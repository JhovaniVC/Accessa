const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const connectDB = require('./src/connection/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Servir archivos estáticos de /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Integradora Backend API' });
});

// Import middlewares and enums for role protection
const { validateToken } = require('./src/middlewares/validateToken');
const roleRoutes = require('./src/routes/role.routes');

// Auth routes
app.use('/api/auth', require('./src/routes/auth.routes'));

// User routes
app.use('/api/users', require('./src/routes/user.routes'));

// Role routes (protected)
app.use('/api/roles', roleRoutes);

// Other routes
app.use('/api/access-logs', require('./src/routes/accessLog.routes'));
app.use('/api/guests', require('./src/routes/guest.routes'));
app.use('/api/notifications', require('./src/routes/notification.routes'));
app.use('/api/qr-codes', require('./src/routes/qrCode.routes'));
app.use('/api/reports', require('./src/routes/reportLog.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
