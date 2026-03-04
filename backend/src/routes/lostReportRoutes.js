const express = require('express');
const { createLostReport, getLostReports, updateLostReportStatus } = require('../controllers/lostReportController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/', authMiddleware, createLostReport);
router.get('/', authMiddleware, getLostReports);
router.patch('/:id/status', authMiddleware, updateLostReportStatus);

module.exports = router;
