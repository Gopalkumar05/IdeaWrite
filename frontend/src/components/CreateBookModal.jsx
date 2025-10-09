// components/CreateBookModal.js
import React, { useState } from 'react';

const CreateBookModal = ({ onCreate, onCancel, isLoading }) => {
  const [title, setTitle] = useState('My Digital Journal');
  const [description, setDescription] = useState('My personal journal');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate(title, description);
    }
  };

  const handleQuickCreate = () => {
    onCreate('My Digital Journal', 'My personal journal');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Journal</h2>
          
          {/* Quick Create Option */}
          <div className="mb-6">
            <button
              onClick={handleQuickCreate}
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <span>📖</span>
                  Quick Create
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Creates a journal with default settings
            </p>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or customize</span>
            </div>
          </div>

          {/* Custom Create Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Journal Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter journal title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isLoading}
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {title.length}/100 characters
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your journal..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/200 characters
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading || !title.trim()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                Create Journal
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBookModal;