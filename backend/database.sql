-- Lost ID & Document Recovery System Database Schema

CREATE DATABASE lost_id_db;

\c lost_id_db;

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lost Reports Table
CREATE TABLE lost_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'national_id', 'passport', 'driving_license', 'school_id'
    document_number VARCHAR(100),
    owner_name VARCHAR(255) NOT NULL,
    lost_date DATE,
    lost_location TEXT,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'matched', 'recovered'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Found Reports Table
CREATE TABLE found_reports (
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
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'matched', 'returned'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document Images Table
CREATE TABLE document_images (
    id SERIAL PRIMARY KEY,
    report_id INTEGER,
    report_type VARCHAR(10), -- 'lost' or 'found'
    image_path VARCHAR(500) NOT NULL,
    ocr_text TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches Table
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    lost_report_id INTEGER REFERENCES lost_reports(id) ON DELETE CASCADE,
    found_report_id INTEGER REFERENCES found_reports(id) ON DELETE CASCADE,
    match_score INTEGER, -- 0-100 percentage
    match_details JSONB,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'rejected'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_lost_reports_user ON lost_reports(user_id);
CREATE INDEX idx_lost_reports_status ON lost_reports(status);
CREATE INDEX idx_found_reports_status ON found_reports(status);
CREATE INDEX idx_matches_lost ON matches(lost_report_id);
CREATE INDEX idx_matches_found ON matches(found_report_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
