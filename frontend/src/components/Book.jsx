

import React, { useState, useEffect, useRef, useCallback } from 'react';
import BookCover from './BookCover';
import BookPages from './BookPages';
import ControlPanel from './ControlPanel';
import CustomizationPanel from './CustomizationPanel';
import SearchPanel from './SearchPanel';
import TemplatesPanel from './TemplatesPanel';
import NavigationButtons from './NavigationButtons';
import BookListPanel from './BookListPanel';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import CreateBookModal from './CreateBookModal';
import { properInitialPages, FONT_OPTIONS, TEXTURE_OPTIONS, PAGE_TEMPLATES } from '../data/constants';
import { bookAPI, pageAPI, uploadAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { downloadAsHTML, generateSimplePDF } from '../utils/pdfGenerator';

const Book = () => {
  const { user, logout } = useAuth();
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [editingPage, setEditingPage] = useState(1);
  const [customization, setCustomization] = useState({});
  const [showTemplates, setShowTemplates] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [showBookList, setShowBookList] = useState(false);
  const [userBooks, setUserBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef(null);

  // Check for mobile device - FIXED: empty dependency array
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []); // ✅ Empty dependency array

  // Load user books - FIXED: empty dependency array
  useEffect(() => {
    loadUserBooks();
  }, []); // ✅ Empty dependency array

  const loadUserBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookAPI.getUserBooks();
      setUserBooks(response.books || []);
      
      if (response.books && response.books.length > 0) {
        await switchBook(response.books[0]._id);
      }
    } catch (err) {
      console.error('Error loading books:', err);
      setError('Failed to load journals');
      setUserBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBook = async (bookId) => {
    try {
      setLoading(true);
      console.log('📖 Loading book:', bookId);
      const book = await bookAPI.getBook(bookId);
      
      const processedPages = book.pages && book.pages.length > 0 
        ? book.pages.map(page => {
            const cust = page.customization || {};
            const backgroundImage = cust.backgroundImage;
            
            if (backgroundImage) {
              const img = new Image();
              const imageUrl = backgroundImage.startsWith('http') 
                ? backgroundImage 
                : `http://localhost:5000${backgroundImage}`;
              img.src = imageUrl;
            }
            
            return {
              ...page,
              customization: {
                textColor: cust.textColor || '#2d3748',
                fontSize: cust.fontSize || 16,
                fontFamily: cust.fontFamily || 'Inter, sans-serif',
                backgroundColor: cust.backgroundColor || '#ffffff',
                lineHeight: cust.lineHeight || 1.6,
                texture: cust.texture || 'none',
                backgroundImage: backgroundImage || null,
              }
            };
          })
        : properInitialPages;
      
      setCurrentBook(book);
      setPages(processedPages);
      
      // ✅ FIXED: Only update customization if needed
      if (isBookOpen && processedPages[editingPage]) {
        const newCustomization = processedPages[editingPage].customization;
        // Compare before updating to avoid unnecessary re-renders
        if (JSON.stringify(newCustomization) !== JSON.stringify(customization)) {
          setCustomization(newCustomization);
        }
      }
      
      setError(null);
      console.log('🎯 Book state updated with', processedPages.length, 'pages');
      
    } catch (err) {
      console.error('❌ Error loading book:', err);
      setError('Failed to load journal');
      setPages(properInitialPages);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = async (e, pageIndex) => {
    const newContent = e.target.value;
    
    // ✅ FIXED: Use functional update to avoid dependency on current pages
    setPages(prevPages => 
      prevPages.map((page, index) =>
        index === pageIndex ? { ...page, content: newContent } : page
      )
    );

    if (currentBook && pages[pageIndex]?._id) {
      try {
        await pageAPI.updatePage(currentBook._id, pages[pageIndex]._id, { content: newContent });
      } catch (error) {
        console.error('Error saving page content:', error);
        // Rollback on error
        setPages(prevPages => prevPages);
      }
    }
  };

  const updatePageCustomization = async (newCustomization) => {
    // ✅ FIXED: Use functional update
    setPages(prevPages => 
      prevPages.map((page, index) =>
        index === editingPage ? { ...page, customization: newCustomization } : page
      )
    );
    
    // Only update if customization actually changed
    if (JSON.stringify(newCustomization) !== JSON.stringify(customization)) {
      setCustomization(newCustomization);
    }

    if (currentBook && pages[editingPage]?._id) {
      try {
        await pageAPI.updatePage(currentBook._id, pages[editingPage]._id, { customization: newCustomization });
      } catch (error) {
        console.error('Error saving customization:', error);
        // Rollback will be handled by the error boundary or we can implement proper rollback
      }
    }
  };

  // ✅ FIXED: useCallback to prevent recreation on every render
  const turnPage = useCallback((direction) => {
    if (isFlipping) return;
    
    if (isMobile) {
      const targetPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
      
      if (targetPage >= 0 && targetPage < pages.length) {
        setIsFlipping(true);
        setCurrentPage(targetPage);
        setEditingPage(targetPage);
        setTimeout(() => setIsFlipping(false), 400);
      }
    } else {
      const targetPage = direction === 'next' ? currentPage + 2 : currentPage - 2;
      
      if (targetPage >= 0 && targetPage < pages.length) {
        setIsFlipping(true);
        setCurrentPage(targetPage);
        
        const newEditingPage = targetPage + 1;
        if (newEditingPage < pages.length) {
          setEditingPage(newEditingPage);
        }
        
        setTimeout(() => setIsFlipping(false), 400);
      }
    }
  }, [isFlipping, isMobile, currentPage, pages.length]);

  // ✅ FIXED: Update customization only when editingPage changes
  useEffect(() => {
    if (!Array.isArray(pages) || pages.length <= editingPage || !pages[editingPage]) return;
    
    const newCustomization = pages[editingPage]?.customization || {};
    
    // Deep comparison to avoid unnecessary updates
    if (JSON.stringify(newCustomization) !== JSON.stringify(customization)) {
      setCustomization(newCustomization);
    }
  }, [editingPage]); // ✅ Only depend on editingPage, not pages

  // ✅ FIXED: Another useEffect for when pages change significantly
  useEffect(() => {
    if (isBookOpen && pages[editingPage]) {
      const newCustomization = pages[editingPage].customization || {};
      if (JSON.stringify(newCustomization) !== JSON.stringify(customization)) {
        setCustomization(newCustomization);
      }
    }
  }, [pages.length]); // ✅ Only when pages length changes significantly

  const addPageSpread = async (template = null) => {
    try {
      const safePages = Array.isArray(pages) ? pages : [];
      if (currentBook?._id) {
        const response = await pageAPI.addPageSpread(currentBook._id, { template });
        const updatedBook = await bookAPI.getBook(currentBook._id);
        const newPages = updatedBook.pages;

        if (newPages && newPages.length > safePages.length) {
          const newSpreadIndex = isMobile ? safePages.length : safePages.length;
          setIsFlipping(true);
          setPages(newPages);
          setCurrentPage(newSpreadIndex);
          setEditingPage(newSpreadIndex);
          setCurrentBook(prevBook => ({ ...prevBook, pages: newPages }));

          setTimeout(() => {
            setIsFlipping(false);
          }, 400);
        }
      }
    } catch (error) {
      console.error("Error adding page spread:", error);
      setError('Failed to add pages. Please try again.');
    } finally {
      setShowTemplates(false);
    }
  };

  const applyTemplate = async (template) => {
    // ✅ FIXED: Functional update
    setPages(prevPages => 
      prevPages.map((page, index) =>
        index === editingPage ? { ...page, content: template.content, type: template.type } : page
      )
    );

    if (currentBook && pages[editingPage]?._id) {
      try {
        await pageAPI.updatePage(currentBook._id, pages[editingPage]._id, {
          content: template.content,
          type: template.type
        });
      } catch (error) {
        console.error('Error applying template:', error);
        // Rollback handled by error boundary
      }
    }
    setShowTemplates(false);
  };

  const handleImageUpload = async (e, pageIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('🚀 START: Image upload process for page:', pageIndex);
    const originalPages = [...pages];

    try {
      const formData = new FormData();
      formData.append('background', file);
      
      const uploadResponse = await uploadAPI.uploadBackground(formData);
      const uploadedUrl = uploadResponse?.filePath;
      
      if (!uploadedUrl) {
        throw new Error('Upload failed - no file path returned');
      }

      const currentPageCustomization = pages[pageIndex]?.customization || {};
      const finalCustomization = {
        ...currentPageCustomization,
        backgroundImage: uploadedUrl
      };

      if (!currentBook || !pages[pageIndex]?._id) {
        throw new Error('Missing bookId or pageId');
      }

      const updateResponse = await pageAPI.updatePage(
        currentBook._id, 
        pages[pageIndex]._id, 
        { customization: finalCustomization }
      );
      
      if (updateResponse.page) {
        // ✅ FIXED: Functional update
        setPages(prevPages => 
          prevPages.map((page, idx) =>
            idx === pageIndex ? updateResponse.page : page
          )
        );
        
        if (updateResponse.book) {
          setCurrentBook(updateResponse.book);
        }
        
        if (editingPage === pageIndex) {
          setCustomization(updateResponse.page.customization);
        }
      }

      console.log('🎉 SUCCESS: Background image uploaded and displayed!');
      setError('✅ Background image uploaded successfully!');
      setTimeout(() => setError(null), 3000);

    } catch (error) {
      console.error('❌ FAILED: Image upload process failed:', error);
      setError(`Upload failed: ${error.message}`);
      
      setPages(originalPages);
      if (editingPage === pageIndex) {
        setCustomization(originalPages[pageIndex]?.customization || {});
      }
    }
  };

  const removeBackground = async (pageIndex) => {
    const originalPages = [...pages];
    const finalCustomization = { ...originalPages[pageIndex].customization, backgroundImage: null };

    // ✅ FIXED: Functional update
    setPages(prevPages =>
      prevPages.map((p, i) => (i === pageIndex ? { ...p, customization: finalCustomization } : p))
    );
    
    if (editingPage === pageIndex) {
      setCustomization(finalCustomization);
    }

    try {
      if (currentBook && originalPages[pageIndex]?._id) {
        await pageAPI.updatePage(currentBook._id, originalPages[pageIndex]._id, { customization: finalCustomization });
      }
      console.log(`✅ Background removed from page ${pageIndex}`);
    } catch (err) {
      console.error('❌ Remove failed:', err);
      setError('Failed to remove background');
      setPages(originalPages);
      if (editingPage === pageIndex) {
        setCustomization(originalPages[pageIndex].customization || {});
      }
    }
  };

  // ✅ FIXED: Open book with useCallback
  const openBook = useCallback(() => {
    setIsBookOpen(true);
    const startPage = isMobile ? 1 : 0;
    setCurrentPage(startPage);
    setEditingPage(1);
  }, [isMobile]);

  const closeBook = () => {
    setIsBookOpen(false);
    setTimeout(() => setCurrentPage(0), 500);
  };

  const searchPages = () => {
    if (!searchQuery.trim()) return [];
    return pages.filter((page, index) => 
      index > 0 && page.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const navigateToPage = (pageIndex) => {
    if (isMobile) {
      if (pageIndex >= 0 && pageIndex < pages.length) {
        setCurrentPage(pageIndex);
        setEditingPage(pageIndex);
      }
    } else {
      const targetSpread = pageIndex % 2 === 0 ? pageIndex : pageIndex - 1;
      if (targetSpread >= 0 && targetSpread < pages.length) {
        setCurrentPage(targetSpread);
        setEditingPage(pageIndex);
      }
    }
    setShowSearch(false);
    setSearchQuery('');
  };

  const createNewBook = async (title = 'My Digital NoteBook', description = 'My personal NoteBook') => {
    try {
      setLoading(true);
      const response = await bookAPI.createBook({ title, description, pages: properInitialPages });
      const newBook = response.book;
      setCurrentBook(newBook);
      setPages(newBook.pages && newBook.pages.length >= 3 ? newBook.pages : properInitialPages);
      await loadUserBooks();
      return newBook;
    } catch (error) {
      console.error('Error creating book:', error);
      setError('Failed to create journal');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const switchBook = async (bookId) => {
    try {
      await loadBook(bookId);
      setShowBookList(false);
      if (isBookOpen) {
        closeBook();
        setTimeout(openBook, 600);
      }
    } catch (error) {
      console.error('Error switching book:', error);
      setError('Failed to switch journal');
    }
  };

  const deleteBook = async (bookId) => {
    try {
      setLoading(true);
      await bookAPI.deleteBook(bookId);
      await loadUserBooks();
      setError('Journal deleted successfully');
      setTimeout(() => setError(null), 3000);
    } catch (error) {
      console.error('Error deleting book:', error);
      setError('Failed to delete journal.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (bookId) => {
    const bookToDelete = userBooks.find(book => book._id === bookId);
    if (bookToDelete) {
      setDeleteConfirm(bookToDelete);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteBook(deleteConfirm._id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting book:', error);
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => setDeleteConfirm(null);

  const downloadBook = async (format = 'html') => {
    if (!currentBook || !pages.length) {
      setError('No book content to download');
      return;
    }
    try {
      setIsDownloading(true);
      if (format === 'pdf') {
        await generateSimplePDF(currentBook, pages, user);
      } else {
        await downloadAsHTML(currentBook, pages, user);
      }
    } catch (error) {
      console.error('Error downloading book:', error);
      setError('Failed to download journal.');
    } finally {
      setIsDownloading(false);
    }
  };

  const quickCreateBook = useCallback(() => setShowCreateModal(true), []);

  const handleCreateBook = async (title, description) => {
    try {
      await createNewBook(title, description);
      setShowCreateModal(false);
      if (!isBookOpen) {
        openBook();
      }
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  const handleCancelCreate = () => setShowCreateModal(false);

  const handlePageClick = useCallback((pageIndex, event) => {
    if (pageIndex === 0) {
      if (!isBookOpen) {
        openBook();
      }
      return;
    }

    if (pageIndex > 0 && isBookOpen) {
      setEditingPage(pageIndex);
    }
  }, [isBookOpen, openBook]);

  if (loading && userBooks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Loading your journals...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4 flex flex-col justify-center items-center font-sans overflow-hidden relative">
     {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {error}
          <button onClick={() => setError(null)} className="ml-4 text-white hover:text-red-200">×</button>
        </div>
      )}
      {isDownloading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-700">Generating download...</span>
          </div>
        </div>
      )}
      {deleteConfirm && (
        <DeleteConfirmationModal book={deleteConfirm} onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}
      {showCreateModal && (
        <CreateBookModal onCreate={handleCreateBook} onCancel={handleCancelCreate} isLoading={loading} />
      )}

      <ControlPanel
        isBookOpen={isBookOpen}
        openBook={openBook}
        closeBook={closeBook}
        currentPage={currentPage}
        pages={pages}
        setShowCustomization={setShowCustomization}
        setShowTemplates={setShowTemplates}
        setShowSearch={setShowSearch}
        addPageSpread={addPageSpread}
        showCustomization={showCustomization}
        showTemplates={showTemplates}
        showSearch={showSearch}
        currentBook={currentBook}
        books={userBooks}
        setShowBookList={setShowBookList}
        user={user}
        onLogout={logout}
        createNewBook={quickCreateBook}
        isLoading={loading}
        isFlipping={isFlipping}
        onDownloadBook={downloadBook}
        isDownloading={isDownloading}
        isMobile={isMobile}
      />

      {showBookList && (
        <BookListPanel
          userBooks={userBooks}
          currentBook={currentBook}
          onSwitchBook={switchBook}
          onCreateNewBook={createNewBook}
          onDeleteBook={handleDeleteClick}
          onClose={() => setShowBookList(false)}
        />
      )}
      {showSearch && isBookOpen && (
        <SearchPanel searchQuery={searchQuery} setSearchQuery={setSearchQuery} setShowSearch={setShowSearch} searchPages={searchPages} navigateToPage={navigateToPage} />
      )}
      {showTemplates && isBookOpen && (
        <TemplatesPanel setShowTemplates={setShowTemplates} applyTemplate={applyTemplate} addPageSpread={addPageSpread} PAGE_TEMPLATES={PAGE_TEMPLATES} />
      )}
      {showCustomization && (
        <CustomizationPanel setShowCustomization={setShowCustomization} isBookOpen={isBookOpen} currentPage={currentPage} editingPage={editingPage} setEditingPage={setEditingPage} pages={pages} customization={customization} updatePageCustomization={updatePageCustomization} fileInputRef={fileInputRef} handleImageUpload={handleImageUpload} removeBackground={removeBackground} FONT_OPTIONS={FONT_OPTIONS} TEXTURE_OPTIONS={TEXTURE_OPTIONS} />
      )}
      
      <div className={`book-container ${isMobile ? 'mobile' : ''}`}>
        <div className={`book ${isBookOpen ? 'book-open' : ''} ${isMobile ? 'mobile' : ''}`}>
          <BookCover 
            isBookOpen={isBookOpen} 
            pages={pages} 
            currentBook={currentBook} 
            onCreateNewBook={quickCreateBook}
            onPageClick={handlePageClick}
             isMobile={isMobile}  
          />
          <BookPages 
            pages={pages} 
            currentPage={currentPage} 
            isBookOpen={isBookOpen} 
            handleTextChange={handleTextChange} 
            removeBackground={removeBackground}
            onPageClick={handlePageClick}
            isMobile={isMobile}
          />
        </div>
      </div>
      
      {isBookOpen && pages.length > (isMobile ? 1 : 2) && (
        <NavigationButtons 
          turnPage={turnPage} 
          isFlipping={isFlipping} 
          currentPage={currentPage} 
          pages={pages || []} 
          isMobile={isMobile}
        />
      )}

      <style>{`
        .book-container {
          width: 90vw;
          max-width: 1200px;
          height: 65vh;
          max-height: 800px;
          perspective: 2500px;
        }
        .book-container.mobile {
          width: 95vw;
          height: 70vh;
         
          perspective: 2000px;
        }
        .book {
          width: 100%;
          height: 100%;
        
          position: relative;
          transform-style: preserve-3d;
          transform: rotateY(-20deg) translateX(-50%);
          transition: transform 1s cubic-bezier(0.68, -5.55, 0.27, 1.55);
        }
        .book.mobile {
          // transform: rotateY(-10deg) translateX(-50%);
           transform: rotateY(0deg) translateX(0%);
        }
        .book-open {
          transform: rotateY(0deg) translateX(0%);
        }
        .book-open.mobile {
          transform: rotateY(0deg) translateX(0%);
        }
        
        /* Mobile specific styles */
        @media (max-width: 768px) {
          .book-container {
            height: 70vh;
                 
          }
        }
      `}</style>



    </div>
  );
};

export default Book;
