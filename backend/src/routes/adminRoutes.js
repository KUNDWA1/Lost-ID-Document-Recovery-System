const express = require('express');
const { getStatistics, getAllReports, getDocumentTypeStats, getRecentActivity } = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Admin dashboard endpoints (protected)
router.get('/statistics', authMiddleware, getStatistics);
router.get('/reports', authMiddleware, getAllReports);
router.get('/document-stats', authMiddleware, getDocumentTypeStats);
router.get('/recent-activity', authMiddleware, getRecentActivity);

module.exports = router;
