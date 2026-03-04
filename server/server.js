const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database Connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api', require('./routes/api'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/guides', require('./routes/guideRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/career', require('./routes/careerRoutes'));
app.use('/api/marketplace', require('./routes/marketplaceRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/transport', require('./routes/transportRoutes'));
app.use('/api/heritage', require('./routes/heritageRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/api/version', (req, res) => {
    res.json({ version: '1.0.1-fix-stats', timestamp: Date.now() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
