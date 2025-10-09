

// routes/books.js - Updated version
const express = require('express');
const Book = require('../models/Book');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Input validation
const bookValidation = {
  create: [
    body('title').isLength({ min: 1, max: 100 }).trim().escape(),
    body('description').optional().isLength({ max: 200 }).trim().escape()
  ]
};

// Get all books for user with pagination
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const books = await Book.find({
      $or: [
        { owner: req.userId },
        { 'collaborators.user': req.userId }
      ]
    })
    .populate('owner', 'username email avatar')
    .populate('collaborators.user', 'username email avatar')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Book.countDocuments({
      $or: [
        { owner: req.userId },
        { 'collaborators.user': req.userId }
      ]
    });

    res.json({
      books,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasMore: skip + books.length < total
      }
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({
      message: 'Error fetching books',
      error: error.message
    });
  }
});

// Get single book
router.get('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.userId },
        { 'collaborators.user': req.userId }
      ]
    })
    .populate('owner', 'username email avatar')
    .populate('collaborators.user', 'username email avatar');

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({
      message: 'Error fetching book',
      error: error.message
    });
  }
});

// Create new book
router.post('/', auth, bookValidation.create, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, coverImage, tags, isPublic = false } = req.body;

    // Create initial pages
    const initialPages = [
      {
        pageNumber: 0,
        content: '',
        type: 'blank',
        customization: {
          backgroundColor: '#f8f5f0',
          texture: 'none'
        }
      },
      {
        pageNumber: 1,
        content: '# Welcome to Your Digital Journal! ✨\n\nStart writing your story...',
        type: 'text',
        customization: {
          textColor: '#2d3748',
          fontSize: 16,
          fontFamily: 'Inter, sans-serif',
          backgroundColor: '#ffffff',
          lineHeight: 1.6,
          texture: 'none'
        }
      }
    ];

    const book = new Book({
      title: title || 'My Digital Journal',
      description: description || 'My personal journal',
      coverImage,
      tags: tags || [],
      isPublic,
      pages: initialPages,
      owner: req.userId
    });

    await book.save();
    await book.populate('owner', 'username email avatar');

    res.status(201).json({
      message: 'Book created successfully',
      book
    });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({
      message: 'Error creating book',
      error: error.message
    });
  }
});

// Update book
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, coverImage, tags, isPublic } = req.body;

    const book = await Book.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [
          { owner: req.userId },
          { 'collaborators.user': req.userId, 'collaborators.role': { $in: ['editor', 'admin'] } }
        ]
      },
      {
        title,
        description,
        coverImage,
        tags,
        isPublic
      },
      { new: true, runValidators: true }
    )
    .populate('owner', 'username email avatar')
    .populate('collaborators.user', 'username email avatar');

    if (!book) {
      return res.status(404).json({
        message: 'Book not found or access denied'
      });
    }

    res.json({
      message: 'Book updated successfully',
      book
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({
      message: 'Error updating book',
      error: error.message
    });
  }
});

// Delete book
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId // Only owner can delete
    });

    if (!book) {
      return res.status(404).json({
        message: 'Book not found or access denied'
      });
    }

    res.json({
      message: 'Book deleted successfully',
      deletedBookId: req.params.id
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({
      message: 'Error deleting book',
      error: error.message
    });
  }
});

// Add collaborator
router.post('/:id/collaborators', auth, async (req, res) => {
  try {
    const { userId, role = 'viewer' } = req.body;

    const book = await Book.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.userId // Only owner can add collaborators
      },
      {
        $addToSet: {
          collaborators: { user: userId, role }
        }
      },
      { new: true }
    )
    .populate('owner', 'username email avatar')
    .populate('collaborators.user', 'username email avatar');

    if (!book) {
      return res.status(404).json({
        message: 'Book not found or access denied'
      });
    }

    res.json({
      message: 'Collaborator added successfully',
      book
    });
  } catch (error) {
    console.error('Error adding collaborator:', error);
    res.status(500).json({
      message: 'Error adding collaborator',
      error: error.message
    });
  }
});

// Remove collaborator
router.delete('/:id/collaborators/:userId', auth, async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.userId
      },
      {
        $pull: {
          collaborators: { user: req.params.userId }
        }
      },
      { new: true }
    )
    .populate('owner', 'username email avatar')
    .populate('collaborators.user', 'username email avatar');

    if (!book) {
      return res.status(404).json({
        message: 'Book not found or access denied'
      });
    }

    res.json({
      message: 'Collaborator removed successfully',
      book
    });
  } catch (error) {
    console.error('Error removing collaborator:', error);
    res.status(500).json({
      message: 'Error removing collaborator',
      error: error.message
    });
  }
});



// Export book
router.post('/:id/export', auth, async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.userId },
        { 'collaborators.user': req.userId }
      ]
    }).populate('owner', 'username email avatar');

    if (!book) {
      return res.status(404).json({ message: 'Book not found or access denied' });
    }

    // Example: export book as JSON
    const exportData = {
      title: book.title,
      description: book.description,
      pages: book.pages,
      tags: book.tags,
      owner: book.owner,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt
    };

    // You could also implement PDF export here using a library like pdfkit

    res.json({
      message: 'Export successful',
      data: exportData
    });
  } catch (error) {
    console.error('Error exporting book:', error);
    res.status(500).json({
      message: 'Export failed',
      error: error.message
    });
  }
});



module.exports = router;