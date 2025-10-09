

// // src/components/BookPages.js - COMPLETE FILE
// import React from "react";
// import PageFace from "./PageFace";
// import { getFullImageUrl } from '../services/api';

// const BookPages = ({
//   pages = [],
//   currentPage,
//   isBookOpen,
//   handleTextChange,
//   removeBackground,
//   onPageClick,
// }) => {
//   const getPageStyle = (pageIndex) => {
//     if (pageIndex < 0 || pageIndex >= pages.length) return {};
//     const page = pages[pageIndex];
//     if (!page || !page.customization) return {};

//     const {
//       textColor = '#2d3748',
//       fontSize = 16,
//       fontFamily = 'Inter, sans-serif',
//       lineHeight = 1.6,
//       backgroundColor = '#ffffff',
//       backgroundImage,
//       texture = 'none',
//     } = page.customization;

//     console.log(`🎨 Rendering Page ${pageIndex}:`, { 
//       backgroundImage, 
//       hasBackground: !!backgroundImage 
//     });

//     const baseStyle = {
//       color: textColor,
//       fontSize: `${fontSize}px`,
//       fontFamily,
//       lineHeight,
//       backgroundColor: backgroundColor,
//       position: 'relative',
//       width: '100%',
//       height: '100%',
//     };

//     // ✅ FIXED: Background image with proper URL resolution
//     if (backgroundImage) {
//       const fullImageUrl = getFullImageUrl(backgroundImage);
//       console.log(`🖼️ Setting background for page ${pageIndex}:`, fullImageUrl);
      
//       baseStyle.backgroundImage = `url(${fullImageUrl})`;
//       baseStyle.backgroundSize = "cover";
//       baseStyle.backgroundPosition = "center";
//       baseStyle.backgroundRepeat = "no-repeat";
//       baseStyle.backgroundAttachment = "local";
//     } 
//     // Apply texture only if no background image
//     else if (texture && texture !== "none") {
//       switch (texture) {
//         case "lined":
//           baseStyle.backgroundImage = `linear-gradient(to bottom, transparent 95%, ${textColor}15 95%)`;
//           baseStyle.backgroundSize = "100% 1.8em";
//           break;
//         case "grid":
//           baseStyle.backgroundImage = `
//             linear-gradient(to right, ${textColor}10 1px, transparent 1px),
//             linear-gradient(to bottom, ${textColor}10 1px, transparent 1px)
//           `;
//           baseStyle.backgroundSize = "20px 20px";
//           break;
//         case "dots":
//           baseStyle.backgroundImage = `radial-gradient(${textColor}15 1px, transparent 1px)`;
//           baseStyle.backgroundSize = "20px 20px";
//           break;
//         default:
//           break;
//       }
//     }

//     return baseStyle;
//   };

//   const handlePageFaceClick = (pageIndex, event) => {
//     if (pageIndex === 0) {
//       return;
//     }

//     if (onPageClick) {
//       onPageClick(pageIndex, event);
//     }
//   };

//   const renderPageLeaves = () => {
//     const leaves = [];

//     for (let i = 0; i < pages.length; i += 2) {
//       const leftPageIndex = i;
//       const rightPageIndex = i + 1;
//       const isFlipped = i < currentPage;

//       leaves.push(
//         <div
//           key={`leaf-${i}`}
//           className={`book-leaf ${isFlipped ? "flipped" : ""}`}
//           style={{
//             zIndex: pages.length - i,
//             display: isBookOpen ? "block" : "none",
//           }}
//         >
//           {/* Front of the leaf (right page) */}
//           <div
//             className="page-face page-front"
//             onClick={(e) => handlePageFaceClick(rightPageIndex, e)}
//           >
//             {rightPageIndex < pages.length ? (
//               <PageFace
//                 pageIndex={rightPageIndex}
//                 pages={pages}
//                 getPageStyle={getPageStyle}
//                 handleTextChange={handleTextChange}
//                 removeBackground={removeBackground}
//               />
//             ) : (
//               <div className="w-full h-full bg-white" />
//             )}
//           </div>

//           {/* Back of the leaf (left page) */}
//           <div
//             className="page-face page-back"
//             onClick={(e) => handlePageFaceClick(leftPageIndex, e)}
//           >
//             <PageFace
//               pageIndex={leftPageIndex}
//               pages={pages}
//               getPageStyle={getPageStyle}
//               handleTextChange={handleTextChange}
//               removeBackground={removeBackground}
//             />
//           </div>
//         </div>
//       );
//     }

//     return leaves;
//   };

//   return (
//     <>
//       {renderPageLeaves()}

//       <style>{`
//         .book-leaf {
//           position: absolute;
//           width: 50%;
//           height: 100%;
//           top: 0;
//           left: 50%;
//           transform-origin: left;
//           transform-style: preserve-3d;
//           transition: transform 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55);
//           border-radius: 0 12px 12px 0;
//           box-shadow: 
//             0 10px 40px rgba(0,0,0,0.3),
//             inset 0 0 0 1px rgba(255,255,255,0.1);
//         }
//         .book-leaf.flipped {
//           transform: rotateY(-180deg);
//         }
//         .page-face {
//           position: absolute;
//           width: 100%;
//           height: 100%;
//           backface-visibility: hidden;
//           border-radius: 0 12px 12px 0;
//           overflow: hidden;
//           cursor: pointer;
//         }
//         .page-face.page-front {
//           cursor: pointer;
//         }
//         .page-face.page-back {
//           transform: rotateY(180deg);
//           border-radius: 12px 0 0 12px;
//           cursor: pointer;
//         }
        
//         .page-face:hover::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: rgba(0, 0, 0, 0.03);
//           pointer-events: none;
//           z-index: 1;
//         }
        
//         .page-face.page-front:hover::before {
//           background: linear-gradient(to left, rgba(0, 0, 0, 0.05), transparent);
//         }
        
//         .page-face.page-back:hover::before {
//           background: linear-gradient(to right, rgba(0, 0, 0, 0.05), transparent);
//         }
//       `}</style>
//     </>
//   );
// };

// export default BookPages;

// src/components/BookPages.js
import React from "react";
import PageFace from "./PageFace";
import { getFullImageUrl } from '../services/api';

const BookPages = ({
  pages = [],
  currentPage,
  isBookOpen,
  handleTextChange,
  removeBackground,
  onPageClick,
  isMobile = false,
}) => {
  const getPageStyle = (pageIndex) => {
    if (pageIndex < 0 || pageIndex >= pages.length) return {};
    const page = pages[pageIndex];
    if (!page || !page.customization) return {};

    const {
      textColor = '#2d3748',
      fontSize = 16,
      fontFamily = 'Inter, sans-serif',
      lineHeight = 1.6,
      backgroundColor = '#ffffff',
      backgroundImage,
      texture = 'none',
    } = page.customization;

    const baseStyle = {
      color: textColor,
      fontSize: `${fontSize}px`,
      fontFamily,
      lineHeight,
      backgroundColor: backgroundColor,
      position: 'relative',
      width: '100%',
      height: '100%',
    };

    if (backgroundImage) {
      const fullImageUrl = getFullImageUrl(backgroundImage);
      baseStyle.backgroundImage = `url(${fullImageUrl})`;
      baseStyle.backgroundSize = "cover";
      baseStyle.backgroundPosition = "center";
      baseStyle.backgroundRepeat = "no-repeat";
      baseStyle.backgroundAttachment = "local";
    } 
    else if (texture && texture !== "none") {
      switch (texture) {
        case "lined":
          baseStyle.backgroundImage = `linear-gradient(to bottom, transparent 95%, ${textColor}15 95%)`;
          baseStyle.backgroundSize = "100% 1.8em";
          break;
        case "grid":
          baseStyle.backgroundImage = `
            linear-gradient(to right, ${textColor}10 1px, transparent 1px),
            linear-gradient(to bottom, ${textColor}10 1px, transparent 1px)
          `;
          baseStyle.backgroundSize = "20px 20px";
          break;
        case "dots":
          baseStyle.backgroundImage = `radial-gradient(${textColor}15 1px, transparent 1px)`;
          baseStyle.backgroundSize = "20px 20px";
          break;
        default:
          break;
      }
    }

    return baseStyle;
  };

  const handlePageFaceClick = (pageIndex, event) => {
    if (onPageClick) {
      onPageClick(pageIndex, event);
    }
  };

  const renderPageLeaves = () => {
    if (isMobile) {
      // MOBILE: Single page rendering
      return pages.map((page, index) => {
        if (index === 0) return null; // Skip cover in mobile open view
        
        const isActive = index === currentPage;
        const isFlipped = index < currentPage;

        return (
          <div
            key={`mobile-page-${index}`}
            className={`book-leaf mobile ${isFlipped ? "flipped" : ""} ${isActive ? "active" : ""}`}
            style={{
              zIndex: pages.length - index,
              display: isBookOpen ? "block" : "none",
            }}
          >
            {/* Single page for mobile */}
            <div
              className="page-face page-front mobile"
              onClick={(e) => handlePageFaceClick(index, e)}
            >
              <PageFace
                pageIndex={index}
                pages={pages}
                getPageStyle={getPageStyle}
                handleTextChange={handleTextChange}
                removeBackground={removeBackground}
                isMobile={isMobile}
              />
            </div>
          </div>
        );
      }).filter(Boolean);
    } else {
      // DESKTOP: Two-page spread rendering
      const leaves = [];
      for (let i = 0; i < pages.length; i += 2) {
        const leftPageIndex = i;
        const rightPageIndex = i + 1;
        const isFlipped = i < currentPage;

        leaves.push(
          <div
            key={`leaf-${i}`}
            className={`book-leaf ${isFlipped ? "flipped" : ""}`}
            style={{
              zIndex: pages.length - i,
              display: isBookOpen ? "block" : "none",
            }}
          >
            {/* Front of the leaf (right page) */}
            <div
              className="page-face page-front"
              onClick={(e) => handlePageFaceClick(rightPageIndex, e)}
            >
              {rightPageIndex < pages.length ? (
                <PageFace
                  pageIndex={rightPageIndex}
                  pages={pages}
                  getPageStyle={getPageStyle}
                  handleTextChange={handleTextChange}
                  removeBackground={removeBackground}
                />
              ) : (
                <div className="w-full h-full bg-white" />
              )}
            </div>

            {/* Back of the leaf (left page) */}
            <div
              className="page-face page-back"
              onClick={(e) => handlePageFaceClick(leftPageIndex, e)}
            >
              <PageFace
                pageIndex={leftPageIndex}
                pages={pages}
                getPageStyle={getPageStyle}
                handleTextChange={handleTextChange}
                removeBackground={removeBackground}
              />
            </div>
          </div>
        );
      }
      return leaves;
    }
  };

  return (
    <>
      {renderPageLeaves()}

      <style>{`
        .book-leaf {
          position: absolute;
          width: 50%;
          height: 100%;
          top: 0;
          left: 50%;
          transform-origin: left;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55);
          border-radius: 0 12px 12px 0;
          box-shadow: 
            0 10px 40px rgba(0,0,0,0.3),
            inset 0 0 0 1px rgba(255,255,255,0.1);
        }
        
        /* Mobile leaf styles */
        .book-leaf.mobile {
          width: 100%;
          left: 0;
          border-radius: 12px;
        }
        
        .book-leaf.mobile:not(.active) {
          display: none;
        }
        
        .book-leaf.flipped {
          transform: rotateY(-180deg);
        }
        
        .page-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 0 12px 12px 0;
          overflow: hidden;
          cursor: pointer;
        }
        
        /* Mobile page face */
        .page-face.mobile {
          border-radius: 12px;
          width: 100%;
        }
        
        .page-face.page-front {
          cursor: pointer;
        }
        
        .page-face.page-back {
          transform: rotateY(180deg);
          border-radius: 12px 0 0 12px;
          cursor: pointer;
        }
        
        .page-face.page-back.mobile {
          border-radius: 12px;
        }
        
        .page-face:hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.03);
          pointer-events: none;
          z-index: 1;
        }
        
        .page-face.page-front:hover::before {
          background: linear-gradient(to left, rgba(0, 0, 0, 0.05), transparent);
        }
        
        .page-face.page-back:hover::before {
          background: linear-gradient(to right, rgba(0, 0, 0, 0.05), transparent);
        }
        
        /* Mobile specific styles */
        @media (max-width: 768px) {
          .book-leaf {
            border-radius: 12px;
          }
          
          .page-face {
            border-radius: 12px;
          }
        }
      `}</style>
    </>
  );
};

export default BookPages;