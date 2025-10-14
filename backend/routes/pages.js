


const express = require('express');
const Book = require('../models/Book');
const auth = require('../middleware/auth');

const router = express.Router();


router.get('/book/:bookId', auth, async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.bookId,
      $or: [
        { owner: req.userId },
        { 'collaborators.user': req.userId }
      ]
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book.pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({
      message: 'Error fetching pages',
      error: error.message,
    });
  }
});



router.put('/:pageId/book/:bookId', auth, async (req, res) => {
  try {
  
    
    const { content, type, customization } = req.body;


    const book = await Book.findOne({
      _id: req.params.bookId,
      $or: [
        { owner: req.userId },
        { 'collaborators.user': req.userId, 'collaborators.role': { $in: ['editor', 'admin'] } }
      ]
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found or access denied' });
    }

    const page = book.pages.id(req.params.pageId);
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }




    if (customization) {
      if (customization.backgroundImage !== undefined) {
        page.customization.backgroundImage = customization.backgroundImage;
  
      }
      if (customization.textColor !== undefined) page.customization.textColor = customization.textColor;
      if (customization.fontSize !== undefined) page.customization.fontSize = customization.fontSize;
      if (customization.fontFamily !== undefined) page.customization.fontFamily = customization.fontFamily;
      if (customization.backgroundColor !== undefined) page.customization.backgroundColor = customization.backgroundColor;
      if (customization.lineHeight !== undefined) page.customization.lineHeight = customization.lineHeight;
      if (customization.texture !== undefined) page.customization.texture = customization.texture;
    }


    if (content !== undefined) page.content = content;
    if (type !== undefined) page.type = type;

   
    const savedBook = await book.save();
    

 
    const updatedBook = await Book.findById(book._id)
      .populate('owner', 'username email avatar')
      .populate('collaborators.user', 'username email avatar');


    const updatedPage = updatedBook.pages.id(req.params.pageId);

   
    res.json({
      message: 'Page updated successfully',
      page: updatedPage,
      book: updatedBook
    });

  } catch (error) {
    console.error('❌ Error updating page:', error);
    res.status(500).json({
      message: 'Error updating page',
      error: error.message
    });
  }
});


router.post('/book/:bookId/spread', auth, async (req, res) => {
  try {
    const { template } = req.body;

    const book = await Book.findOne({
      _id: req.params.bookId,
      $or: [
        { owner: req.userId },
        {
          'collaborators.user': req.userId,
          'collaborators.role': { $in: ['editor', 'owner'] },
        },
      ],
    });

    if (!book) {
      return res.status(404).json({
        message: 'Book not found or insufficient permissions',
      });
    }

    const lastPageNumber =
      book.pages.length > 0
        ? book.pages[book.pages.length - 1].pageNumber
        : -1;

    const baseCustomization = book.pages[1]?.customization || {
      textColor: '#2d3748',
      fontSize: 16,
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#ffffff',
      lineHeight: 1.6,
      texture: 'none',
    };

    const newLeftPage = {
      pageNumber: lastPageNumber + 1,
      content:
        template?.content ||
        `## New Page ${lastPageNumber + 1}\n\nStart writing here...`,
      type: template?.type || 'text',
      customization: { ...baseCustomization },
    };

    const newRightPage = {
      pageNumber: lastPageNumber + 2,
      content:
        template?.content ||
        `## New Page ${lastPageNumber + 2}\n\nStart writing here...`,
      type: template?.type || 'text',
      customization: { ...baseCustomization },
    };

    book.pages.push(newLeftPage, newRightPage);
    await book.save();

    res.status(201).json({
      message: 'Page spread added successfully',
      pages: book.pages.slice(-2),
    });
  } catch (error) {
    console.error('Error adding page spread:', error);
    res.status(500).json({
      message: 'Error adding page spread',
      error: error.message,
    });
  }
});

/* -------------------- DELETE PAGE -------------------- */
router.delete('/:pageId/book/:bookId', auth, async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.bookId,
      owner: req.userId,
    });

    if (!book) {
      return res.status(404).json({
        message: 'Book not found or insufficient permissions',
      });
    }

    book.pages.pull({ _id: req.params.pageId });
    await book.save();

    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({
      message: 'Error deleting page',
      error: error.message,
    });
  }
});

module.exports = router;
