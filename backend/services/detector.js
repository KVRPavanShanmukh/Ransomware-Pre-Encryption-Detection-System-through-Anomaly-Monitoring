const db = require('../config/db');
const mailer = require('./mailer');

/*
  Threshold Engine State
  We keep a sliding window (e.g. 2 seconds) of file modifications per PID.
  Format: { pid: { process_name, writes: [{ path, time }] } }
*/
const windowState = {};
const WINDOW_DURATION_MS = 2000;

// Run a background cleanup to remove old entries from windowState
setInterval(() => {
    const now = Date.now();
    for (const pid in windowState) {
        windowState[pid].writes = windowState[pid].writes.filter(w => now - w.time < WINDOW_DURATION_MS);
        if (windowState[pid].writes.length === 0) {
            delete windowState[pid];
        }
    }
}, 1000);

let whitelistCache = new Set();
let lastCacheSync = 0;

const getWhitelist = async () => {
    // Sync cache every 60 seconds
    if (Date.now() - lastCacheSync > 60000) {
        try {
            const [rows] = await db.query('SELECT process_name FROM process_whitelist');
            whitelistCache = new Set(rows.map(r => r.process_name.toLowerCase()));
            lastCacheSync = Date.now();
        } catch (err) {
            console.error('[ERR] Whitelist sync failed:', err.message);
        }
    }
    return whitelistCache;
};

const triggerAlert = async (processName, pid, reason, severity = 'CRITICAL') => {
    const actionTaken = 'Process Terminated via RPC (Simulated)';
    console.log(`\n🚨 [ALERT] ${severity} Threat Detected! PID: ${pid} (${processName}) => ${reason}`);
    console.log(`[ACTION] ${actionTaken}`);

    try {
        // 1. Save to DB
        const [result] = await db.query(
            `INSERT INTO alerts (severity, process_name, pid, trigger_reason, action_taken)
       VALUES (?, ?, ?, ?, ?)`,
            [severity, processName, pid, reason, actionTaken]
        );

        // 2. Clear state so we don't double-trigger immediately for the same PID
        delete windowState[pid];

        // 3. Send Multi-Channel Alerts
        mailer.sendAlertEmail({ process_name: processName, pid, severity, trigger_reason: reason, action_taken: actionTaken });

    } catch (err) {
        console.error('[ERR] Failed to process alert:', err.message);
    }
};

const analyze = async (logEntry) => {
    const { event_id, process_name, pid, target_path, access_type, entropy } = logEntry;

    // 1. Whitelist Check
    const whitelist = await getWhitelist();
    if (whitelist.has(process_name.toLowerCase())) {
        // Ignore trusted system processes
        return;
    }

    // We are interested in file modifications (Event 4663 Write/Delete, or Entropy spikes)
    const isModification = access_type === 'Write' || access_type === 'Delete' || event_id === 11 || event_id === 4660;

    if (isModification) {
        if (!windowState[pid]) {
            windowState[pid] = { process_name, writes: [] };
        }

        windowState[pid].writes.push({ path: target_path, time: Date.now(), entropy: parseFloat(entropy) });

        const recentWrites = windowState[pid].writes;
        const writeCount = recentWrites.length;

        // RULE 1: Specific Ransomware Behavior - >1 file write in short window by untrusted PID
        if (writeCount > 1) {
            const reason = `Aggressive File Modification: ${writeCount} writes in <2s window.`;
            await triggerAlert(process_name, pid, reason, 'CRITICAL');
            return;
        }

        // RULE 2: Entropy Spike + Write
        if (entropy > 7.9) {
            const reason = `High Entropy File Write Detected (Entropy: ${entropy}). Possible Encryption.`;
            await triggerAlert(process_name, pid, reason, 'HIGH');
            return;
        }
    }
};

module.exports = { analyze, triggerAlert };
