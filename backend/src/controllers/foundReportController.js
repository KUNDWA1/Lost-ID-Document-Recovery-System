const pool = require('../config/database');
const { extractTextFromImage, extractDocumentInfo } = require('../services/ocrService');
const { findMatches } = require('../services/matchingService');

const createFoundReport = async (req, res) => {
  try {
    const { finder_name, finder_phone, finder_email, document_type, document_number, owner_name, found_date, found_location, description } = req.body;
    
    let ocr_extracted_text = null;
    let image_path = null;

    if (req.file) {
      image_path = req.file.path;
      ocr_extracted_text = await extractTextFromImage(image_path);
      
      if (ocr_extracted_text) {
        const extractedInfo = extractDocumentInfo(ocr_extracted_text);
        if (!document_number && extractedInfo.documentNumber) {
          req.body.document_number = extractedInfo.documentNumber;
        }
        if (!owner_name && extractedInfo.name) {
          req.body.owner_name = extractedInfo.name;
        }
      }
    }

    const result = await pool.query(
      'INSERT INTO found_reports (finder_name, finder_phone, finder_email, document_type, document_number, owner_name, found_date, found_location, description, image_path, ocr_extracted_text) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [finder_name, finder_phone, finder_email, document_type, req.body.document_number || document_number, req.body.owner_name || owner_name, found_date, found_location, description, image_path, ocr_extracted_text]
    );

    const foundReport = result.rows[0];

    // Find matches
    const matches = await findMatches(foundReport.id);
    
    // Save matches and create notifications
    for (const match of matches) {
      const matchResult = await pool.query(
        'INSERT INTO matches (lost_report_id, found_report_id, match_score, match_details) VALUES ($1, $2, $3, $4) RETURNING *',
        [match.lostReportId, match.foundReportId, match.score, JSON.stringify(match.details)]
      );

      const lostReport = await pool.query('SELECT user_id FROM lost_reports WHERE id = $1', [match.lostReportId]);
      await pool.query(
        'INSERT INTO notifications (user_id, match_id, message) VALUES ($1, $2, $3)',
        [lostReport.rows[0].user_id, matchResult.rows[0].id, `Possible match found for your lost document! Match score: ${match.score}%`]
      );
    }

    res.status(201).json({ report: foundReport, matchesFound: matches.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFoundReports = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM found_reports ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createFoundReport, getFoundReports };
