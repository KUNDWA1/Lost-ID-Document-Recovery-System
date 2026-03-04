# Lost ID & Document Recovery System - Backend

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup PostgreSQL Database
```bash
# Create database and tables
psql -U postgres -f database.sql
```

### 3. Configure Environment
```bash
# Copy .env.example to .env
copy .env.example .env

# Edit .env with your database credentials
```

### 4. Run the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Lost Reports (Protected)
- `POST /api/lost-reports` - Create lost report
- `GET /api/lost-reports` - Get user's lost reports
- `PATCH /api/lost-reports/:id/status` - Update report status

### Found Reports
- `POST /api/found-reports` - Create found report (with image upload)
- `GET /api/found-reports` - Get all found reports

### Matches (Protected)
- `GET /api/matches` - Get user's matches
- `PATCH /api/matches/:id/status` - Update match status

## Features
✅ User authentication (JWT)
✅ Lost document reporting
✅ Found document reporting with image upload
✅ OCR text extraction (Tesseract.js)
✅ Automatic matching algorithm
✅ Match notifications
✅ PostgreSQL database

## Tech Stack
- Node.js + Express
- PostgreSQL
- JWT Authentication
- Tesseract.js (OCR)
- Multer (File uploads)
