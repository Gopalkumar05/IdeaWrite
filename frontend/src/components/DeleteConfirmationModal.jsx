// components/DeleteConfirmationModal.js
import React from 'react';

const DeleteConfirmationModal = ({ book, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Delete NoteBook?
          </h3>
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete <strong>"{book.title}"</strong>?
          </p>
          <p className="text-red-600 text-sm mb-6">
            This action cannot be undone. All pages and content will be permanently deleted.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
