const express = require('express');
const { createLostReport, getLostReports, updateLostReportStatus } = require('../controllers/lostReportController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /api/lost-reports:
 *   post:
 *     summary: Report a lost document
 *     tags: [Lost Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               document_type:
 *                 type: string
 *               document_number:
 *                 type: string
 *               owner_name:
 *                 type: string
 *               lost_date:
 *                 type: string
 *               lost_location:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lost report created
 */
router.post('/', authMiddleware, createLostReport);

/**
 * @swagger
 * /api/lost-reports:
 *   get:
 *     summary: Get user's lost reports
 *     tags: [Lost Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of lost reports
 */
router.get('/', authMiddleware, getLostReports);

router.patch('/:id/status', authMiddleware, updateLostReportStatus);

module.exports = router;
