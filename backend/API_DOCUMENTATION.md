# 🚀 Lost ID Recovery System - Complete API Documentation

Base URL: `http://localhost:5000/api`

---

## 🔐 Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "0788123456",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "0788123456"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Login User
**POST** `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 📄 Lost Reports Endpoints (Protected)

### 3. Report Lost Document
**POST** `/lost-reports`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "document_type": "national_id",
  "document_number": "1234567890123456",
  "owner_name": "John Doe",
  "lost_date": "2024-01-15",
  "lost_location": "Kigali City, Near KBC",
  "description": "Lost near bus station"
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "document_type": "national_id",
  "document_number": "1234567890123456",
  "owner_name": "John Doe",
  "status": "active",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 4. Get My Lost Reports
**GET** `/lost-reports`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "document_type": "national_id",
    "document_number": "1234567890123456",
    "owner_name": "John Doe",
    "status": "active",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

---

### 5. Update Lost Report Status
**PATCH** `/lost-reports/:id/status`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "status": "recovered"
}
```

---

## 📷 Found Reports Endpoints

### 6. Report Found Document (with Image)
**POST** `/found-reports`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `finder_name`: Jane Smith
- `finder_phone`: 0788654321
- `finder_email`: jane@example.com
- `document_type`: national_id
- `document_number`: 1234567890123456 (optional - OCR will extract)
- `owner_name`: John Doe (optional - OCR will extract)
- `found_date`: 2024-01-16
- `found_location`: Kigali City
- `description`: Found near bus station
- `image`: [file upload]

**Response:**
```json
{
  "report": {
    "id": 1,
    "finder_name": "Jane Smith",
    "document_type": "national_id",
    "ocr_extracted_text": "REPUBLIC OF RWANDA...",
    "created_at": "2024-01-16T14:20:00Z"
  },
  "matchesFound": 1
}
```

**Note:** OCR automatically extracts text from image and triggers matching!

---

### 7. Get All Found Reports
**GET** `/found-reports`

**Response:**
```json
[
  {
    "id": 1,
    "finder_name": "Jane Smith",
    "document_type": "national_id",
    "image_path": "uploads/1234567890-id.jpg",
    "status": "pending",
    "created_at": "2024-01-16T14:20:00Z"
  }
]
```

---

## 🎯 Matches Endpoints (Protected)

### 8. Get My Matches
**GET** `/matches`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "lost_report_id": 1,
    "found_report_id": 1,
    "match_score": 80,
    "match_details": {
      "documentNumberMatch": true,
      "nameMatch": true,
      "documentTypeMatch": true
    },
    "status": "pending",
    "finder_name": "Jane Smith",
    "finder_phone": "0788654321",
    "created_at": "2024-01-16T14:20:00Z"
  }
]
```

---

### 9. Update Match Status
**PATCH** `/matches/:id/status`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "status": "confirmed"
}
```

**Status Options:** `pending`, `confirmed`, `rejected`

---

## 🔔 Notifications Endpoints (Protected)

### 10. Get My Notifications
**GET** `/notifications`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "message": "Possible match found for your lost document! Match score: 80%",
    "is_read": false,
    "match_score": 80,
    "document_type": "national_id",
    "created_at": "2024-01-16T14:20:00Z"
  }
]
```

---

### 11. Mark Notification as Read
**PATCH** `/notifications/:id/read`

**Headers:**
```
Authorization: Bearer <token>
```

---

### 12. Mark All Notifications as Read
**PATCH** `/notifications/read-all`

**Headers:**
```
Authorization: Bearer <token>
```

---

## 🏥 Health Check

### 13. Health Check
**GET** `/health`

**Response:**
```json
{
  "status": "OK",
  "message": "Lost ID Recovery System API"
}
```

---

## 🔄 Complete User Flow

1. **User registers** → `POST /auth/register`
2. **User logs in** → `POST /auth/login` (get token)
3. **User reports lost ID** → `POST /lost-reports` (with token)
4. **Finder uploads found ID** → `POST /found-reports` (with image)
5. **OCR extracts text** → Automatic
6. **System matches** → Automatic (creates match + notification)
7. **User checks notifications** → `GET /notifications` (with token)
8. **User views matches** → `GET /matches` (with token)
9. **User confirms match** → `PATCH /matches/:id/status` (with token)
10. **User marks as recovered** → `PATCH /lost-reports/:id/status` (with token)

---

## 🎯 Matching Algorithm

**Match Score Calculation:**
- Document number exact match: **50 points**
- Owner name similarity (>80%): **30 points**
- Document type match: **20 points**

**Minimum match threshold:** 50 points

**Match triggers:**
- Automatic notification to document owner
- Match record created with confidence score
- Status tracking (pending → confirmed → recovered)

---

## 🔒 Security Features

✅ JWT authentication
✅ Password hashing (bcrypt)
✅ Protected routes
✅ SQL injection prevention (parameterized queries)
✅ File upload validation
✅ CORS enabled

---

## 📊 Document Types Supported

- `national_id` - National ID Card
- `passport` - Passport
- `driving_license` - Driving License
- `school_id` - School ID Card

---

## 🧪 Testing with cURL

See `API_TESTING.md` for complete cURL examples.

---

## 🚀 Production Deployment

See `RENDER_DEPLOY.md` for deployment guide.
