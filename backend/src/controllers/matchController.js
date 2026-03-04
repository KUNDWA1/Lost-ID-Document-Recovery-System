const pool = require('../config/database');

const getMatches = async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await pool.query(
      `SELECT m.*, lr.document_type, lr.owner_name as lost_owner, fr.finder_name, fr.finder_phone 
       FROM matches m
       JOIN lost_reports lr ON m.lost_report_id = lr.id
       JOIN found_reports fr ON m.found_report_id = fr.id
       WHERE lr.user_id = $1
       ORDER BY m.created_at DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMatchStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query('UPDATE matches SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getMatches, updateMatchStatus };
