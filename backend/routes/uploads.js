const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload background image
router.post('/background', auth, upload.single('background'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded'
      });
    }

    res.json({
      message: 'File uploaded successfully',
      filePath: `/uploads/${req.file.filename}`,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error uploading file',
      error: error.message
    });
  }
});

// Serve uploaded files
router.use('/files', express.static('uploads'));

module.exports = router;