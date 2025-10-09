const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Security Middleware

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate Limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digital_journal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/uploads', require('./routes/uploads'));


// Basic Route
// app.get('/', (req, res) => {
//   res.json({ message: 'Digital Journal API is running!' });
// });
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// React Router fallback (exclude API & uploads)
app.get(/^\/(?!api|uploads).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});



// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// ✅ 404 Handler (fixed)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});







const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});