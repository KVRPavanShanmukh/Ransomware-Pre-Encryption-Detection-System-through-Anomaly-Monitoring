const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// GET /api/alerts - Fetch all alerts
router.get('/', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM alerts ORDER BY timestamp DESC LIMIT 50'
        );
        res.json({ alerts: rows });
    } catch (err) {
        console.error('[ERR] Failed to fetch alerts:', err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// PUT /api/alerts/:id/resolve - Mark alert as resolved
router.put('/:id/resolve', verifyToken, async (req, res) => {
    try {
        const alertId = req.params.id;
        await db.query('UPDATE alerts SET resolved = TRUE WHERE id = ?', [alertId]);
        res.json({ message: 'Alert resolved successfully' });
    } catch (err) {
        console.error('[ERR] Failed to resolve alert:', err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
