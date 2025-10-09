
import React from 'react';

const NavigationButtons = ({ turnPage, isFlipping, currentPage, pages = [], isMobile = false }) => {
  const canGoNext = isMobile 
    ? currentPage < pages.length - 1 
    : currentPage < pages.length - 2;
  
  const canGoPrev = isMobile 
    ? currentPage > 1  // Skip cover in mobile
    : currentPage > 0;

  return (
    <div className={`navigation-buttons ${isMobile ? 'mobile' : ''}`}>
      <button
        onClick={() => turnPage('prev')}
        disabled={!canGoPrev || isFlipping}
        className="nav-button prev-button"
      >
        ← Previous
      </button>
      
      <div className="page-indicator">
        Page {isMobile ? currentPage : `${currentPage + 1}-${currentPage + 2}`} of {pages.length}
      </div>
      
      <button
        onClick={() => turnPage('next')}
        disabled={!canGoNext || isFlipping}
        className="nav-button next-button"
      >
        Next →
      </button>

      <style>{`
        .navigation-buttons {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 2rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 1rem 2rem;
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          z-index: 100;
        }
        
        .navigation-buttons.mobile {
          bottom: 1rem;
          padding: 0.75rem 1.5rem;
          gap: 1rem;
        }
        
        .nav-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 25px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .nav-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
        
        .nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .page-indicator {
          color: white;
          font-weight: 500;
          min-width: 120px;
          text-align: center;
        }
        
        @media (max-width: 768px) {
          .nav-button {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }
          
          .page-indicator {
            min-width: 100px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default NavigationButtons;