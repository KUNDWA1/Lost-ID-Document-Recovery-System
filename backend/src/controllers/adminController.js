const pool = require('../config/database');

// Get system statistics
const getStatistics = async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM lost_reports) as total_lost_reports,
        (SELECT COUNT(*) FROM found_reports) as total_found_reports,
        (SELECT COUNT(*) FROM matches WHERE status = 'confirmed') as successful_matches,
        (SELECT COUNT(*) FROM lost_reports WHERE status = 'recovered') as recovered_documents,
        (SELECT COUNT(*) FROM lost_reports WHERE created_at > NOW() - INTERVAL '30 days') as reports_last_30_days
    `);
    
    const matchRate = stats.rows[0].total_lost_reports > 0 
      ? ((stats.rows[0].successful_matches / stats.rows[0].total_lost_reports) * 100).toFixed(2)
      : 0;

    res.json({
      ...stats.rows[0],
      match_success_rate: `${matchRate}%`,
      system_status: 'operational'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all reports (admin view)
const getAllReports = async (req, res) => {
  try {
    const { type, status, limit = 50 } = req.query;
    
    let query = type === 'lost' 
      ? 'SELECT lr.*, u.full_name as reporter_name, u.email FROM lost_reports lr JOIN users u ON lr.user_id = u.id'
      : 'SELECT * FROM found_reports';
    
    if (status) {
      query += ` WHERE status = '${status}'`;
    }
    
    query += ` ORDER BY created_at DESC LIMIT ${limit}`;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get document type breakdown
const getDocumentTypeStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        document_type,
        COUNT(*) as count,
        COUNT(CASE WHEN status = 'recovered' THEN 1 END) as recovered
      FROM lost_reports
      GROUP BY document_type
      ORDER BY count DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get recent activity
const getRecentActivity = async (req, res) => {
  try {
    const result = await pool.query(`
      (SELECT 'lost_report' as type, id, created_at, owner_name as name FROM lost_reports ORDER BY created_at DESC LIMIT 10)
      UNION ALL
      (SELECT 'found_report' as type, id, created_at, finder_name as name FROM found_reports ORDER BY created_at DESC LIMIT 10)
      UNION ALL
      (SELECT 'match' as type, id, created_at, 'Match Created' as name FROM matches ORDER BY created_at DESC LIMIT 10)
      ORDER BY created_at DESC LIMIT 20
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  getStatistics, 
  getAllReports, 
  getDocumentTypeStats,
  getRecentActivity 
};
