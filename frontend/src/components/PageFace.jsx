
// import React from 'react';

// const PageFace = ({ pageIndex, pages, getPageStyle, handleTextChange, removeBackground }) => {
//   if (!pages[pageIndex]) return <div className="page-face-content"></div>;
  

//   const isCoverPage = pageIndex === 0;
  
//   return (
//     <div className="page-face-content" style={getPageStyle(pageIndex)}>
//       <div className="page-content-wrapper">
//         {isCoverPage ? (
//           // Cover page - show read-only content
//           <div className="cover-content">
//             <div className="text-4xl font-bold mb-4 text-center">
//               {pages[pageIndex].content || 'Digital Journal'}
//             </div>
//             <div className="text-lg text-center opacity-80">
//               {pages[pageIndex].customization?.description || 'Your stories await...'}
//             </div>
//             <div className="absolute bottom-4 left-0 right-0 text-center text-sm opacity-60">
//               Click to open journal
//             </div>
//           </div>
//         ) : (
//           // Regular page - editable textarea
//           <>
//             <textarea
//               value={pages[pageIndex].content}
//               onChange={(e) => handleTextChange(e, pageIndex)}
//               className="page-textarea"
//               style={{
//                 color: pages[pageIndex].customization.textColor,
//                 fontSize: `${pages[pageIndex].customization.fontSize}px`,
//                 fontFamily: pages[pageIndex].customization.fontFamily,
//                 lineHeight: pages[pageIndex].customization.lineHeight,
//                 background: 'transparent'
//               }}
//               placeholder="Start writing your story..."
//             />
//             {pages[pageIndex].background && (
//               <button 
//                 onClick={() => removeBackground(pageIndex)}
//                 className="remove-bg-btn"
//                 title="Remove background"
//               >
//                 🗑️
//               </button>
//             )}
//           </>
//         )}
//       </div>
      
//       {/* Show page number for all pages except cover */}
//       {!isCoverPage && (
//         <span className="page-number">{pageIndex}</span>
//       )}
      
//       <style>{`
//         .page-face-content {
//           width: 100%;
//           height: 100%;
//           box-sizing: border-box;
//           padding: 3rem;
//           background-color: #fff;
//           overflow-y: auto;
//           position: relative;
//         }
//         .page-content-wrapper {
//           position: relative;
//           width: 100%;
//           height: 100%;
//         }
//         .cover-content {
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//           align-items: center;
//           height: 100%;
//           text-align: center;
//         }
//         .page-textarea {
//           width: 100%;
//           height: 100%;
//           resize: none;
//           background: transparent;
//           border: none;
//           outline: none;
//           padding: 0;
//           margin: 0;
//           font-family: inherit;
//         }
//         .remove-bg-btn {
//           position: absolute;
//           top: 1rem;
//           right: 1rem;
//           background: rgba(0,0,0,0.7);
//           color: white;
//           border: none;
//           border-radius: 50%;
//           width: 2.5rem;
//           height: 2.5rem;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 1.2rem;
//           transition: all 0.2s;
//         }
//         .remove-bg-btn:hover {
//           background: rgba(220,0,0,0.8);
//           transform: scale(1.1);
//         }
//         .page-number {
//           position: absolute;
//           bottom: 1.5rem;
//           right: 2rem;
//           font-size: 0.875rem;
//           color: #999;
//           font-weight: 500;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PageFace;

// src/components/PageFace.js
import React from 'react';

const PageFace = ({ pageIndex, pages, getPageStyle, handleTextChange, isMobile = false }) => {
  if (!pages[pageIndex]) return <div className="page-face-content"></div>;
  
  const isCoverPage = pageIndex === 0;
  
  return (
    <div className={`page-face-content ${isMobile ? 'mobile' : ''}`} style={getPageStyle(pageIndex)}>
      <div className="page-content-wrapper">
        {isCoverPage ? (
          // Cover page - show read-only content
          <div className="cover-content">
            <div className="text-4xl font-bold mb-4 text-center">
              {pages[pageIndex].content || 'Digital Journal'}
            </div>
            <div className="text-lg text-center opacity-80">
              {pages[pageIndex].customization?.description || 'Your stories await...'}
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center text-sm opacity-60">
              Click to open journal
            </div>
          </div>
        ) : (
          // Regular page - editable textarea
          <>
            <textarea
              value={pages[pageIndex].content}
              onChange={(e) => handleTextChange(e, pageIndex)}
              className="page-textarea"
              style={{
                color: pages[pageIndex].customization?.textColor || '#2d3748',
                fontSize: `${pages[pageIndex].customization?.fontSize || 16}px`,
                fontFamily: pages[pageIndex].customization?.fontFamily || 'Inter, sans-serif',
                lineHeight: pages[pageIndex].customization?.lineHeight || 1.6,
                background: 'transparent'
              }}
              placeholder="Start writing your story..."
            />
        
          </>
        )}
      </div>
      
      {/* Show page number for all pages except cover */}
      {!isCoverPage && (
        <span className="page-number">{pageIndex}</span>
      )}
      
      <style>{`
        .page-face-content {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding: 2rem;
          background-color: #fff;
          overflow-y: auto;
          position: relative;
        }
        
        .page-face-content.mobile {
          padding: 1.5rem;
        }
        
        .page-content-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .cover-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          text-align: center;
        }
        
        .page-textarea {
          width: 100%;
          height: 100%;
          resize: none;
          background: transparent;
          border: none;
          outline: none;
          padding: 0;
          margin: 0;
          font-family: inherit;
        }
        
        .remove-bg-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0,0,0,0.7);
          color: white;
          border: none;
          border-radius: 50%;
          width: 2.5rem;
          height: 2.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: all 0.2s;
          z-index: 10;
        }
        
        .remove-bg-btn:hover {
          background: rgba(220,0,0,0.8);
          transform: scale(1.1);
        }
        
        .page-number {
          position: absolute;
          bottom: 1rem;
          right: 1.5rem;
          font-size: 0.875rem;
          color: #999;
          font-weight: 500;
        }
        
        /* Mobile specific styles */
        @media (max-width: 768px) {
          .page-face-content {
            padding: 1.5rem;
          }
          
          .remove-bg-btn {
            top: 0.5rem;
            right: 0.5rem;
            width: 2rem;
            height: 2rem;
            font-size: 1rem;
          }
          
          .page-number {
            bottom: 0.5rem;
            right: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PageFace;