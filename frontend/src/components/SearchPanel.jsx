// components/SearchPanel.js
import React from 'react';

const SearchPanel = ({ searchQuery, setSearchQuery, setShowSearch, searchPages, navigateToPage }) => {
  const searchResults = searchPages();

  return (
    <div className="fixed left-6 top-24 bg-gray-800/95 backdrop-blur-lg text-white p-6 rounded-2xl shadow-2xl w-80 z-50 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Search Pages</h3>
        <button onClick={() => setShowSearch(false)} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Type to search pages..."
        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />
      
      <div className="max-h-60 overflow-y-auto">
        {searchResults.length > 0 ? (
          searchResults.map((page,index) => (
            <div
            key={page._id || page.id || page.pageNumber || index}

              onClick={() => navigateToPage(page.id)}
              className="p-3 mb-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <div className="text-sm font-semibold">Page {page.id}</div>
              <div className="text-xs text-gray-300 truncate">
                {page.content.substring(0, 100)}...
              </div>
            </div>
          ))
        ) : searchQuery ? (
          <div className="text-center text-gray-400 py-4">No pages found</div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchPanel;