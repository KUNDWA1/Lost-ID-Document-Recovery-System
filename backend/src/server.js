const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const lostReportRoutes = require('./routes/lostReportRoutes');
const foundReportRoutes = require('./routes/foundReportRoutes');
const matchRoutes = require('./routes/matchRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lost-reports', lostReportRoutes);
app.use('/api/found-reports', foundReportRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Lost ID Recovery System API' });
});

// Root endpoint with API documentation link
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lost ID Recovery System API</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        h1 { color: #2c3e50; }
        .endpoint { background: #f4f4f4; padding: 10px; margin: 10px 0; border-radius: 5px; }
        .method { color: #27ae60; font-weight: bold; }
        a { color: #3498db; text-decoration: none; }
        .status { color: #27ae60; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>🇷🇼 Lost ID & Document Recovery System API</h1>
      <p class="status">✅ Status: Running</p>
      <p>A National Digital Recovery Platform for Rwanda</p>
      
      <h2>📚 Quick Links</h2>
      <ul>
        <li><a href="/api-docs">🔥 Swagger API Testing</a></li>
        <li><a href="/health">Health Check</a></li>
        <li><a href="https://github.com/KUNDWA1/Lost-ID-Document-Recovery-System" target="_blank">GitHub Repository</a></li>
        <li><a href="https://github.com/KUNDWA1/Lost-ID-Document-Recovery-System/blob/main/backend/API_DOCUMENTATION.md" target="_blank">API Documentation</a></li>
      </ul>

      <h2>🔗 Available Endpoints</h2>
      
      <div class="endpoint">
        <span class="method">POST</span> /api/auth/register - Register new user
      </div>
      <div class="endpoint">
        <span class="method">POST</span> /api/auth/login - Login user
      </div>
      <div class="endpoint">
        <span class="method">POST</span> /api/lost-reports - Report lost document (Protected)
      </div>
      <div class="endpoint">
        <span class="method">GET</span> /api/lost-reports - Get user's lost reports (Protected)
      </div>
      <div class="endpoint">
        <span class="method">POST</span> /api/found-reports - Report found document with image
      </div>
      <div class="endpoint">
        <span class="method">GET</span> /api/found-reports - Get all found reports
      </div>
      <div class="endpoint">
        <span class="method">GET</span> /api/matches - Get user's matches (Protected)
      </div>
      <div class="endpoint">
        <span class="method">GET</span> /api/notifications - Get notifications (Protected)
      </div>
      <div class="endpoint">
        <span class="method">GET</span> /api/admin/statistics - System statistics (Protected)
      </div>

      <h2>🚀 Getting Started</h2>
      <p>Base URL: <code>http://localhost:5000/api</code></p>
      <p>For detailed API documentation, visit the <a href="https://github.com/KUNDWA1/Lost-ID-Document-Recovery-System/blob/main/backend/API_DOCUMENTATION.md" target="_blank">API Documentation</a></p>
      
      <hr>
      <p style="text-align: center; color: #7f8c8d;">Built with 💚 for Rwanda 🇷🇼</p>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Swagger API Testing: http://localhost:${PORT}/api-docs`);
});
