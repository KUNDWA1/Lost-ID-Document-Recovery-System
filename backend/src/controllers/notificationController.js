const pool = require('../config/database');

const getNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await pool.query(
      `SELECT n.*, m.match_score, lr.document_type, lr.owner_name 
       FROM notifications n
       LEFT JOIN matches m ON n.match_id = m.id
       LEFT JOIN lost_reports lr ON m.lost_report_id = lr.id
       WHERE n.user_id = $1
       ORDER BY n.created_at DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *',
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const user_id = req.user.id;
    await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = $1', [user_id]);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead };
