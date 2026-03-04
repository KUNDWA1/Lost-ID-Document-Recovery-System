# Database Setup Instructions

## Option 1: Using pgAdmin (GUI)

1. Open pgAdmin
2. Right-click "Databases" → Create → Database
3. Name: `lost_id_db`
4. Click Save
5. Right-click `lost_id_db` → Query Tool
6. Copy and paste the SQL below
7. Click Execute (F5)

## Option 2: Using Command Line

```bash
# Open Command Prompt as Administrator
# Navigate to PostgreSQL bin folder (usually):
cd "C:\Program Files\PostgreSQL\16\bin"

# Create database
psql -U postgres -c "CREATE DATABASE lost_id_db;"

# Run the schema
psql -U postgres -d lost_id_db -f "C:\Users\divine\Documents\lost id\backend\database.sql"
```

## Option 3: Manual SQL Execution

Connect to PostgreSQL and run:

```sql
-- Create database
CREATE DATABASE lost_id_db;

-- Connect to it
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
    document_type VARCHAR(50) NOT NULL,
    document_number VARCHAR(100),
    owner_name VARCHAR(255) NOT NULL,
    lost_date DATE,
    lost_location TEXT,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
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
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches Table
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    lost_report_id INTEGER REFERENCES lost_reports(id) ON DELETE CASCADE,
    found_report_id INTEGER REFERENCES found_reports(id) ON DELETE CASCADE,
    match_score INTEGER,
    match_details JSONB,
    status VARCHAR(20) DEFAULT 'pending',
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

-- Indexes
CREATE INDEX idx_lost_reports_user ON lost_reports(user_id);
CREATE INDEX idx_lost_reports_status ON lost_reports(status);
CREATE INDEX idx_found_reports_status ON found_reports(status);
CREATE INDEX idx_matches_lost ON matches(lost_report_id);
CREATE INDEX idx_matches_found ON matches(found_report_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
```

## Verify Setup

Run this query to check tables:
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

You should see:
- users
- lost_reports
- found_reports
- matches
- notifications

## Then restart your server:
```bash
npm run dev
```
