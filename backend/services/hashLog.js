const crypto = require('crypto');
const db = require('../config/db');

// Creates a SHA-256 hash of the log entry to detect tampering
const hashLog = async (logId, logData) => {
    try {
        const hash = crypto.createHash('sha256').update(logData).digest('hex');
        await db.query(
            'INSERT INTO log_hashes (log_id, hash_value) VALUES (?, ?)',
            [logId, hash]
        );
    } catch (err) {
        console.error(`[ERR] Failed to hash log ${logId}:`, err.message);
    }
};

module.exports = hashLog;
