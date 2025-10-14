
import React, { useState } from 'react';

const BookListPanel = ({ userBooks, currentBook, onSwitchBook, onCreateNewBook, onDeleteBook, onClose }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookDescription, setNewBookDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const safeUserBooks = Array.isArray(userBooks) ? userBooks : [];
  const booksCount = safeUserBooks.length;

  const handleCreateBook = async (e) => {
    e.preventDefault();
    if (!newBookTitle.trim()) return;
    try {
      setIsCreating(true);
      await onCreateNewBook(newBookTitle, newBookDescription);
      setNewBookTitle('');
      setNewBookDescription('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating book:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getSpreadCount = (book) => {
    if (!book || !Array.isArray(book.pages)) return 0;
    return Math.floor(book.pages.length / 2);
  };
    
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">My Notebooks</h2>
              <p className="text-purple-100 mt-1">{booksCount} NoteBook {booksCount !== 1 ? 's' : ''} created</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-purple-200 text-2xl font-bold transition-colors w-8 h-8 flex items-center justify-center" aria-label="Close">×</button>
          </div>
        </div>

        <div className="p-4 border-b flex-shrink-0">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            disabled={isCreating}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Creating...</>
            ) : (
              <><span>+</span> Create New NoteBook</>
            )}
          </button>
        </div>

        {showCreateForm && (
          <div className="p-4 border-b bg-gray-50 flex-shrink-0">
            <form onSubmit={handleCreateBook} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Journal Title *</label>
                <input type="text" value={newBookTitle} onChange={(e) => setNewBookTitle(e.target.value)} placeholder="Enter NoteBook title..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required disabled={isCreating} maxLength={100} />
                <p className="text-xs text-gray-500 mt-1">{newBookTitle.length}/100 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={newBookDescription} onChange={(e) => setNewBookDescription(e.target.value)} placeholder="Describe your NoteBook..." rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={isCreating} maxLength={200} />
                <p className="text-xs text-gray-500 mt-1">{newBookDescription.length}/200 characters</p>
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={isCreating || !newBookTitle.trim()} className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center gap-2">
                  {isCreating && (<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>)} Create NoteBook
                </button>
                <button type="button" onClick={() => setShowCreateForm(false)} disabled={isCreating} className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-semibold transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {booksCount === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-lg font-semibold">No NoteBook yet</p>
              <p className="mt-2 text-gray-600">Create your first NoteBook to get started!</p>
            </div>
          ) : (
            <div className="grid gap-3 p-4">
              {safeUserBooks.map((book) => (
                <div key={book._id} className={`p-4 border-2 rounded-xl transition-all ${currentBook?._id === book._id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-800 truncate">{book.title || 'Untitled'}</h3>
                      <p className="text-gray-600 mt-1 text-sm line-clamp-2">{book.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                        <span>{getSpreadCount(book)} spreads</span>
                        <span className="text-gray-300">•</span>
                        <span>Created {formatDate(book.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <button onClick={() => onSwitchBook(book._id)} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors">Open</button>
                      {safeUserBooks.length > 1 && (
                        <button onClick={() => onDeleteBook(book._id)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors">Delete</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookListPanel;
