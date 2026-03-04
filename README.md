# Lost ID & Document Recovery System

A centralized system for reporting and recovering lost documents (National IDs, Passports, School IDs, Driving Licenses) with AI-powered OCR matching.

## Features
✅ User authentication (JWT)
✅ Lost document reporting
✅ Found document reporting with image upload
✅ AI OCR text extraction (Tesseract.js)
✅ Automatic matching algorithm
✅ Real-time notifications
✅ PostgreSQL database

## Tech Stack
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **AI/OCR:** Tesseract.js
- **Authentication:** JWT
- **File Upload:** Multer

## Setup

### Backend
```bash
cd backend
npm install
psql -U postgres -f database.sql
copy .env.example .env
npm run dev
```

See [backend/README.md](backend/README.md) for detailed API documentation.

## Project Structure
```
lost-id/
├── backend/          # Node.js API server
│   ├── src/
│   │   ├── config/   # Database config
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/ # OCR & matching
│   │   └── middleware/
│   └── database.sql
└── README.md
```

## API Endpoints
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/lost-reports` - Report lost document
- `POST /api/found-reports` - Report found document (with image)
- `GET /api/matches` - Get matches

## License
MIT
