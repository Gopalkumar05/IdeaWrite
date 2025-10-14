





import React, { useState, useEffect } from 'react';
import { Search,BookDashed,Columns3Cog,FilePlus2,Plus,BookDown,LogOut,Menu,Library  } from 'lucide-react';
const ControlPanel = ({
  isBookOpen,
  openBook,
  closeBook,
  setShowCustomization,
  setShowTemplates,
  setShowSearch,
  addPageSpread,
  showCustomization,
  showTemplates,
  showSearch,
  currentBook,
  setShowBookList,
  user,
  onLogout,
  createNewBook,
  isLoading,
  isAddingPage,
  isFlipping,
  onDownloadBook,
  isDownloading,
  setBgColor
}) => {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
 const [selectedColor, setSelectedColor] = useState("");

  
const handleColorChange = (e) => {
  const newColor = e.target.value;
  setSelectedColor(newColor);
  setBgColor(newColor); 
};

const colors = [
  { name: "Gray", value: "bg-gray-100" },
  { name: "White", value: "bg-white" },
  { name: "Blue", value: "bg-blue-100" },
  { name: "Mint", value: "bg-green-100" },
  { name: "Lavender", value: "bg-purple-100" },
  { name: "Dark", value: "bg-neutral-900 text-white" },
];
  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile menu when book opens/closes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [isBookOpen]);

  const MobileMenuButton = () => (
    <button
      onClick={() => setShowMobileMenu(!showMobileMenu)}
      className="md:hidden bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-lg shadow-lg transition-all duration-300"
    >
      <span className="text-base  md:text-lg"><Menu /></span>
    </button>
  );

  const MainControls = () => (
    <>
      {/* Book List Button */}
      <button
        onClick={() => setShowBookList(true)}
        className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 backdrop-blur-sm text-sm md:text-base"
      >
        <span className="text-base md:text-lg"><Library /></span>
        <span className="hidden sm:inline">Lists</span>
      </button>

      {/* New Book Button */}
      <button
        onClick={createNewBook}
        disabled={isLoading}
        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50 text-sm md:text-base"
      >
        <span className="text-base md:text-lg"><FilePlus2/></span>
        <span className="hidden sm:inline">New</span>
      </button>
    </>
  );

  const BookControls = () => (
    <div className="flex flex-wrap gap-2 justify-center">
      {/* Search Button */}
      <button
        onClick={() => setShowSearch(!showSearch)}
        className={`px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 backdrop-blur-sm text-sm md:text-base ${
          showSearch 
            ? 'bg-blue-500 text-white' 
            : 'bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800'
        }`}
      >
        <span className="text-base md:text-lg"><Search/></span>
        <span className="hidden xs:inline">Search</span>
      </button>

      {/* Templates Button */}
      <button
        onClick={() => setShowTemplates(!showTemplates)}
        className={`px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 backdrop-blur-sm text-sm md:text-base ${
          showTemplates 
            ? 'bg-purple-500 text-white' 
            : 'bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800'
        }`}
      >
        <span className="text-base md:text-lg"><BookDashed/></span>
        <span className="hidden xs:inline">Templates</span>
      </button>

<select
    value={selectedColor}
    onChange={handleColorChange}
    className={`px-2 py-1 md:px-3 md:py-1 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 backdrop-blur-sm text-sm md:text-base ${
          showTemplates 
            ? 'bg-purple-500 text-white' 
            : 'bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800'
        }`}
  >
   
    {colors.map((c) => (
      <option key={c.value} value={c.value}>
        {c.name}
      </option>
    ))}
  </select>
      

      {/* Customize Button */}
      <button
        onClick={() => setShowCustomization(!showCustomization)}
        className={`px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 backdrop-blur-sm text-sm md:text-base ${
          showCustomization 
            ? 'bg-pink-500 text-white' 
            : 'bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800'
        }`}
      >
        <span className="text-base md:text-lg"><Columns3Cog /></span>
        <span className="hidden xs:inline">Customize</span>
      </button>

      {/* Add Page Button */}
      <button
        onClick={() => addPageSpread()}
        disabled={isAddingPage || isFlipping}
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50 text-sm md:text-base"
      >
        <span className="text-base md:text-lg"><Plus /></span>
        <span className="hidden xs:inline">Add Pages</span>
      </button>

      {/* Download Button */}
      <div className="relative">
        <button
          onClick={() => setShowDownloadMenu(!showDownloadMenu)}
          disabled={isDownloading || !currentBook}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50 text-sm md:text-base"
        >
          {isDownloading ? (
            <>
              <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="hidden xs:inline">Generating...</span>
            </>
          ) : (
            <>
              <span className="text-base md:text-lg"><BookDown /></span>
              <span className="hidden xs:inline">Download</span>
            </>
          )}
        </button>

        {/* Download Dropdown Menu */}
        {showDownloadMenu && !isDownloading && (
          <>
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <button
                onClick={() => {
                  onDownloadBook('html');
                  setShowDownloadMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 rounded-t-lg border-b border-gray-100"
              >
                <span className="text-blue-500 text-lg">🌐</span>
                <div>
                  <div className="font-medium text-gray-900 text-sm">Web Page</div>
                  <div className="text-xs text-gray-500">Beautiful online view</div>
                </div>
              </button>
              
              <button
                onClick={() => {
                  onDownloadBook('pdf');
                  setShowDownloadMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 rounded-b-lg"
              >
                <span className="text-red-500 text-lg">📄</span>
                <div>
                  <div className="font-medium text-gray-900 text-sm">PDF Document</div>
                  <div className="text-xs text-gray-500">Simple text format</div>
                </div>
              </button>
            </div>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowDownloadMenu(false)}
            />
          </>
        )}
      </div>
    </div>
  );

  const UserControls = () => (
    <div className="flex items-center gap-2">
      {/* Open/Close Book Button */}
      <button
        onClick={isBookOpen ? closeBook : openBook}
        disabled={isFlipping || !currentBook}
        className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-3 py-2 md:px-6 md:py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 backdrop-blur-sm disabled:opacity-50 text-sm md:text-base"
      >
        <span className="text-base md:text-lg">{isBookOpen ? '📖' : '📘'}</span>
        <span className="hidden sm:inline">
          {isBookOpen ? 'Close' : 'Open'}
        </span>
      </button>

      {/* User Profile */}
      {user && (
        <div className="flex items-center gap-2 bg-white bg-opacity-90 rounded-lg px-3 py-2 backdrop-blur-sm">
          <span className="text-xs md:text-sm text-gray-700 hidden xs:inline">👤 {user.username}</span>
          <button
            onClick={onLogout}
            className="text-xs md:text-lg text-red-500 hover:text-red-700 transition-colors"
          >
        <LogOut />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:flex fixed top-4 left-4 right-4 z-40 justify-between items-center">
        {/* Left Side Controls */}
        <div className="flex items-center gap-3">
          <MainControls />
        </div>

        {/* Center Controls - Only show when book is open */}
        {isBookOpen && (
          <div className="flex items-center gap-3">
            <BookControls />
          </div>
        )}

        {/* Right Side Controls */}
        <div className="flex items-center gap-3">
          <UserControls />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden fixed top-4 left-4 right-4 z-40 flex justify-between items-center">
        {/* Left - Mobile Menu Button and Main Controls */}
        <div className="flex items-center gap-2">
          <MobileMenuButton />
          {!showMobileMenu && <MainControls />}
        </div>

        {/* Right - User Controls */}
        <UserControls />
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setShowMobileMenu(false)}
          />
          
          {/* Mobile Menu */}
          <div className="md:hidden fixed top-20 left-4 right-4 bg-white bg-opacity-95 backdrop-blur-lg rounded-lg shadow-2xl p-4 z-40 transform transition-all duration-300">
            <div className="flex flex-col gap-3">
              {/* Main Controls in Menu */}
              <div className="flex flex-col gap-2 pb-3 border-b border-gray-200">
                <button
                  onClick={() => {
                    setShowBookList(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-3 text-left"
                >
                  <span className="text-lg">📚</span>
                  <span>My Books</span>
                </button>

                <button
                  onClick={() => {
                    createNewBook();
                    setShowMobileMenu(false);
                  }}
                  disabled={isLoading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-3 text-left disabled:opacity-50"
                >
                  <span className="text-lg"><Plus/></span>
                  <span>Create New Notes</span>
                </button>
              </div>

              {/* Book Controls in Menu */}
              {isBookOpen && (
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold text-gray-500 px-2">Notes Tools</h3>
                  <BookControls />
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Add some top padding to prevent content overlap on mobile */}
      <div className="h-20 md:h-16"></div>
    </>
  );
};

export default ControlPanel;
