const express = require('express');
const multer = require('multer');
const { createFoundReport, getFoundReports } = require('../controllers/foundReportController');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.post('/', upload.single('image'), createFoundReport);
router.get('/', getFoundReports);

module.exports = router;
