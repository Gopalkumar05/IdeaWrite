


import React from 'react';

const BookCover = ({ isBookOpen, pages = [], currentBook, onCreateNewBook, onPageClick, isMobile = false }) => {
  const handleCoverClick = (e) => {
    if (onPageClick) {
      onPageClick(0, e); // Cover is page 0
    }
  };

  const handleCreateBookClick = (e) => {
    e.stopPropagation(); // Prevent triggering cover click
    if (onCreateNewBook) {
      onCreateNewBook();
    }
  };

  // Calculate z-index based on pages length
  const coverZIndex = (pages.length || 0) + 2;

  return (
    <div 
      className="book-cover"
      onClick={handleCoverClick}
      style={{ zIndex: coverZIndex }}
    >
      {currentBook ? (
        <>
          <div className="cover-title">
            {currentBook.title}
          </div>
          <div className="cover-description">
            {currentBook.description || 'Your stories await...'}
          </div>
          {currentBook.coverImage && (
            <div className="cover-image-container">
              <img 
                src={currentBook.coverImage} 
                alt="Book cover" 
                className="cover-image"
              />
            </div>
          )}
          {!isBookOpen && (
            <div className="click-hint">
              Click to open Notes
            </div>
          )}
        </>
      ) : (
        <>
          <div className="cover-title">
            Digital Notes
          </div>
          <div className="cover-description">Your stories await...</div>
          <button 
            onClick={handleCreateBookClick}
            className="create-button"
          >
            Start Your First Note
          </button>
        </>
      )}
      
      {!currentBook && (
        <div className="animate-bounce book-icon">📖</div>
      )}
      
      <style>{`
        .book-cover {
          position: absolute;
          width: ${isMobile ? '100%' : '50%'};
          height: 100%;
          top: 0;
          left: ${isMobile ? '0' : '50%'};
          transform-origin: left;
          transform-style: preserve-3d;
          transition: transform 1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
          border-radius: ${isMobile ? '12px' : '0 12px 12px 0'};
          box-shadow: 
            0 10px 40px rgba(0,0,0,0.3),
            inset 0 0 0 1px rgba(255,255,255,0.1);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: ${isMobile ? '2rem' : '3rem'};
          cursor: pointer;
          overflow: hidden;
        }
        
        .book-open .book-cover {
          transform: rotateY(-180deg);
        }
        
        .cover-title {
          font-size: ${isMobile ? '2.5rem' : '3rem'};
          font-weight: bold;
          margin-bottom: 1rem;
          background: linear-gradient(to right, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .cover-description {
          font-size: ${isMobile ? '1rem' : '1.125rem'};
          opacity: 0.9;
          margin-bottom: ${isMobile ? '1.5rem' : '2rem'};
          color: rgba(255, 255, 255, 0.9);
          max-width: 80%;
          line-height: 1.5;
        }
        
        .cover-image-container {
          margin-bottom: 2rem;
          max-width: 100%;
        }
        
        .cover-image {
          max-width: 100%;
          max-height: 12rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        .create-button {
          padding: ${isMobile ? '0.75rem 1.5rem' : '0.875rem 1.75rem'};
          border-radius: 12px;
          color: white;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          cursor: pointer;
          font-size: ${isMobile ? '0.9rem' : '0.95rem'};
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          background: linear-gradient(to right, #059669, #047857);
          margin-bottom: 1rem;
        }
        
        .create-button:hover { 
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }
        
        .click-hint {
          position: absolute;
          bottom: 1.5rem;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 0.875rem;
          opacity: 0.7;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .book-icon {
          font-size: ${isMobile ? '1.5rem' : '2rem'};
          margin-top: 1rem;
        }
        
        /* Mobile specific styles */
        @media (max-width: 768px) {
          .book-cover {
            border-radius: 12px;
            
          }
          
          .cover-title {
            font-size: 2rem;
          }
          
          .cover-description {
            font-size: 0.95rem;
          }
        }
        
        /* Enhanced visual effects */
        .book-cover::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .book-cover:hover::before {
          opacity: 1;
        }
        
        /* Spine effect for desktop */
        .book-cover::after {
          content: '';
          position: absolute;
          left: 0;
          top: 5%;
          bottom: 5%;
          width: 3px;
          background: linear-gradient(to bottom, 
            rgba(255,255,255,0.2) 0%, 
            rgba(255,255,255,0.4) 50%, 
            rgba(255,255,255,0.2) 100%);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default BookCover;
