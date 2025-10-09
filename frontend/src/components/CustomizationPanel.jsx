
import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { getFullImageUrl } from '../services/api';

const CustomizationPanel = ({
  setShowCustomization,
  isBookOpen,
  currentPage,
  editingPage,
  setEditingPage,
  pages,
  customization,
  updatePageCustomization,
  fileInputRef,
  handleImageUpload,
  removeBackground,
  FONT_OPTIONS,
  TEXTURE_OPTIONS
}) => {
  return (
    <div className="fixed right-6 top-24 bg-gray-800/95 backdrop-blur-lg text-white p-6 rounded-2xl shadow-2xl w-80 z-50 border border-gray-700 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          Customize Page
        </h3>
        <button onClick={() => setShowCustomization(false)} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-300">Editing Page:</label>
        <div className="flex gap-2">
          <button 
            onClick={() => setEditingPage(currentPage)} 
            disabled={!isBookOpen || currentPage === 0}
            className={`flex-1 p-3 rounded-lg text-sm transition-all ${
              editingPage === currentPage 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                : 'bg-gray-700 hover:bg-gray-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {currentPage === 0 ? 'Cover' : `Left (${currentPage})`}
          </button>
          <button 
            onClick={() => setEditingPage(currentPage + 1)} 
            disabled={!isBookOpen || !pages[currentPage + 1] || currentPage === 0}
            className={`flex-1 p-3 rounded-lg text-sm transition-all ${
              editingPage === currentPage + 1 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                : 'bg-gray-700 hover:bg-gray-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {currentPage === 0 ? 'Page 1' : `Right (${currentPage + 1})`}
          </button>
        </div>
        
        {editingPage === 0 && (
          <div className="mt-2 p-2 bg-yellow-600 rounded-lg text-xs text-white">
            ⚠ Cover page cannot be edited. Select pages 1 or above.
          </div>
        )}
      </div>


<div className="mb-6">
  <label className="block text-sm font-medium mb-2 text-gray-300">
    Background Image
  </label>
  
  {/* ✅ Real-time background preview with proper URL */}
  {customization.backgroundImage && (
    <div className="mb-3 p-2 bg-gray-700 rounded-lg">
      <p className="text-xs text-green-400 mb-2">✅ Current Background:</p>
      <div 
        className="w-full h-20 bg-cover bg-center rounded border border-gray-600 mb-2"
        style={{ 
          backgroundImage: `url(${getFullImageUrl(customization.backgroundImage)})` 
        }}
      />
      <p className="text-xs text-gray-400 truncate">
        {customization.backgroundImage}
      </p>
    </div>
  )}
  
  <input
    type="file"
    ref={fileInputRef}
    onChange={(e) => handleImageUpload(e, editingPage)}
    accept="image/*"
    className="hidden"
  />
  <div className="flex gap-2">
    <button
      onClick={() => fileInputRef.current?.click()}
      className="flex-1 p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-sm"
    >
      📁 Upload New Image
    </button>
    {customization.backgroundImage && (
      <button
        onClick={() => removeBackground(editingPage)}
        className="p-3 bg-red-600 rounded-lg hover:bg-red-700 transition-colors text-sm"
      >
        🗑️ Remove
      </button>
    )}
  </div>
</div>

      <div className="space-y-6">
        {/* Text Color */}
        <div>
          <label className="block text-sm font-medium mb-3 text-gray-300">Text Color</label>
          <HexColorPicker 
            color={customization.textColor || '#2d3748'} 
            onChange={color => updatePageCustomization({ ...customization, textColor: color })} 
            className="!w-full mb-2"
          />
          <input
            type="text"
            value={customization.textColor || '#2d3748'}
            onChange={(e) => updatePageCustomization({ ...customization, textColor: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
          />
        </div>

        {/* Background Color */}
        <div>
          <label className="block text-sm font-medium mb-3 text-gray-300">Background Color</label>
          <HexColorPicker 
            color={customization.backgroundColor || '#ffffff'} 
            onChange={color => updatePageCustomization({ ...customization, backgroundColor: color })} 
            className="!w-full mb-2"
          />
          <input
            type="text"
            value={customization.backgroundColor || '#ffffff'}
            onChange={(e) => updatePageCustomization({ ...customization, backgroundColor: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"
          />
        </div>

        {/* Font Family */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Font Family</label>
          <select
            value={customization.fontFamily || 'Inter'}
            onChange={(e) => updatePageCustomization({ ...customization, fontFamily: e.target.value })}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {FONT_OPTIONS.map(font => (
              <option key={font.value} value={font.value}>{font.name}</option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Font Size: {customization.fontSize || 16}px
          </label>
          <input
            type="range"
            min="12"
            max="24"
            value={customization.fontSize || 16}
            onChange={(e) => updatePageCustomization({ ...customization, fontSize: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Line Height */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Line Height: {customization.lineHeight || 1.6}
          </label>
          <input
            type="range"
            min="1.2"
            max="2.4"
            step="0.1"
            value={customization.lineHeight || 1.6}
            onChange={(e) => updatePageCustomization({ ...customization, lineHeight: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Page Texture */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Page Texture</label>
          <select
            value={customization.texture || 'none'}
            onChange={(e) => updatePageCustomization({ ...customization, texture: e.target.value })}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {TEXTURE_OPTIONS.map(texture => (
              <option key={texture.value} value={texture.value}>{texture.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <style >{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default CustomizationPanel;