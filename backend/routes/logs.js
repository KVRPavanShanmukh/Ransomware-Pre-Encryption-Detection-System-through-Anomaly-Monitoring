const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');
const detector = require('../services/detector');
const hashLog = require('../services/hashLog');

// GET /api/logs - Fetch paginated logs
router.get('/', verifyToken, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const [rows] = await db.query(
            'SELECT id, event_id, process_name, pid, target_path, access_type, entropy, timestamp FROM event_logs ORDER BY timestamp DESC LIMIT ?',
            [limit]
        );
        res.json({ logs: rows });
    } catch (err) {
        console.error('[ERR] Failed to fetch logs:', err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST /api/logs - Ingest log (called by monitor.js or simulated by frontend)
router.post('/', async (req, res) => {
    try {
        const { event_id, process_name, pid, target_path, access_type, entropy } = req.body;

        // 1. Insert into DB
        const [result] = await db.query(
            `INSERT INTO event_logs 
      (event_id, process_name, pid, target_path, access_type, entropy, timestamp) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [event_id, process_name, pid, target_path, access_type, entropy]
        );

        const logId = result.insertId;

        // 2. Hash and store integrity signature
        const logData = `${logId}:${event_id}:${process_name}:${pid}:${target_path}:${access_type}:${entropy}`;
        await hashLog(logId, logData);

        // 3. Send to Threshold Detection Engine
        detector.analyze(req.body);

        res.status(201).json({ message: 'Log ingested successfully', id: logId });
    } catch (err) {
        console.error('[ERR] Failed to ingest log:', err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
