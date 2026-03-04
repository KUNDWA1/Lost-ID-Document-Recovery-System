# API Testing Guide

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Make sure PostgreSQL is running
# Create database and tables
psql -U postgres -f database.sql
```

### 3. Configure Environment
Edit `.env` file with your database credentials

### 4. Start Server
```bash
npm run dev
```

Server should start at: http://localhost:5000

---

## API Endpoints Testing

### 1. Health Check
```bash
curl http://localhost:5000/health
```

### 2. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"full_name\":\"John Doe\",\"email\":\"john@example.com\",\"phone\":\"0788123456\",\"password\":\"password123\"}"
```

Response: `{ "user": {...}, "token": "..." }`

### 3. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

Response: `{ "user": {...}, "token": "..." }`

**Save the token for next requests!**

### 4. Create Lost Report (Protected)
```bash
curl -X POST http://localhost:5000/api/lost-reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"document_type\":\"national_id\",\"document_number\":\"1234567890123456\",\"owner_name\":\"John Doe\",\"lost_date\":\"2024-01-15\",\"lost_location\":\"Kigali City\",\"description\":\"Lost near bus station\"}"
```

### 5. Get User's Lost Reports (Protected)
```bash
curl http://localhost:5000/api/lost-reports \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Create Found Report (with image)
```bash
curl -X POST http://localhost:5000/api/found-reports \
  -H "Content-Type: multipart/form-data" \
  -F "finder_name=Jane Smith" \
  -F "finder_phone=0788654321" \
  -F "finder_email=jane@example.com" \
  -F "document_type=national_id" \
  -F "document_number=1234567890123456" \
  -F "owner_name=John Doe" \
  -F "found_date=2024-01-16" \
  -F "found_location=Kigali City" \
  -F "description=Found near bus station" \
  -F "image=@path/to/id-image.jpg"
```

### 7. Get All Found Reports
```bash
curl http://localhost:5000/api/found-reports
```

### 8. Get User's Matches (Protected)
```bash
curl http://localhost:5000/api/matches \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 9. Update Match Status (Protected)
```bash
curl -X PATCH http://localhost:5000/api/matches/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"status\":\"confirmed\"}"
```

### 10. Update Lost Report Status (Protected)
```bash
curl -X PATCH http://localhost:5000/api/lost-reports/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"status\":\"recovered\"}"
```

---

## Testing with Postman

1. Import this collection or create requests manually
2. Set base URL: `http://localhost:5000`
3. For protected routes, add header: `Authorization: Bearer <token>`

---

## Expected Flow

1. **User registers** → Gets token
2. **User reports lost document** → Creates lost report
3. **Finder uploads found document** → OCR extracts text
4. **System automatically matches** → Creates match + notification
5. **User checks matches** → Sees potential matches
6. **User confirms match** → Updates status to "confirmed"
7. **User marks as recovered** → Updates lost report status

---

## Common Issues

- **Database connection error**: Check PostgreSQL is running and credentials in `.env`
- **Token invalid**: Make sure to use fresh token from login
- **File upload fails**: Check `uploads/` folder exists
- **OCR not working**: Tesseract.js downloads language data on first run (takes time)
