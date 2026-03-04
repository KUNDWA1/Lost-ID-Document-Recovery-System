const express = require('express');
const { getMatches, updateMatchStatus } = require('../controllers/matchController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware, getMatches);
router.patch('/:id/status', authMiddleware, updateMatchStatus);

module.exports = router;
