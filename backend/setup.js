const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const setupDatabase = async () => {
  try {
    console.log('🔄 Setting up database tables...');

    // Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');

    // Lost Reports Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lost_reports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        document_type VARCHAR(50) NOT NULL,
        document_number VARCHAR(100),
        owner_name VARCHAR(255) NOT NULL,
        lost_date DATE,
        lost_location TEXT,
        description TEXT,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Lost reports table created');

    // Found Reports Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS found_reports (
        id SERIAL PRIMARY KEY,
        finder_name VARCHAR(255) NOT NULL,
        finder_phone VARCHAR(20) NOT NULL,
        finder_email VARCHAR(255),
        document_type VARCHAR(50) NOT NULL,
        document_number VARCHAR(100),
        owner_name VARCHAR(255),
        found_date DATE,
        found_location TEXT,
        description TEXT,
        image_path VARCHAR(500),
        ocr_extracted_text TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Found reports table created');

    // Matches Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        lost_report_id INTEGER REFERENCES lost_reports(id) ON DELETE CASCADE,
        found_report_id INTEGER REFERENCES found_reports(id) ON DELETE CASCADE,
        match_score INTEGER,
        match_details JSONB,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Matches table created');

    // Notifications Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Notifications table created');

    // Indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_lost_reports_user ON lost_reports(user_id);
      CREATE INDEX IF NOT EXISTS idx_lost_reports_status ON lost_reports(status);
      CREATE INDEX IF NOT EXISTS idx_found_reports_status ON found_reports(status);
      CREATE INDEX IF NOT EXISTS idx_matches_lost ON matches(lost_report_id);
      CREATE INDEX IF NOT EXISTS idx_matches_found ON matches(found_report_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
    `);
    console.log('✅ Indexes created');

    console.log('🎉 Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  }
};

setupDatabase();
