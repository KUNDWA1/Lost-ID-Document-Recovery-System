const pool = require('../config/database');

const createLostReport = async (req, res) => {
  try {
    const { document_type, document_number, owner_name, lost_date, lost_location, description } = req.body;
    const user_id = req.user.id;

    const result = await pool.query(
      'INSERT INTO lost_reports (user_id, document_type, document_number, owner_name, lost_date, lost_location, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [user_id, document_type, document_number, owner_name, lost_date, lost_location, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLostReports = async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await pool.query('SELECT * FROM lost_reports WHERE user_id = $1 ORDER BY created_at DESC', [user_id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLostReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query('UPDATE lost_reports SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createLostReport, getLostReports, updateLostReportStatus };
