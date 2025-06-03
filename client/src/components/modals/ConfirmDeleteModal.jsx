import React from 'react';

export default function ConfirmDeleteModal({ isOpen, onCancel, onConfirm }) {
  return (
    isOpen && (
      <dialog className="modal modal-open">
        <div className="modal-box dark:bg-gray-900 dark:text-white relative">
          {/* Close button (top-right) */}
          <button
            onClick={onCancel}
            className="btn btn-sm btn-circle absolute right-4 top-4 text-white bg-red-500 hover:bg-red-600 dark:text-white"
          >
            ✕
          </button>

          <h3 className="font-bold text-lg text-red-600 dark:text-red-400 mt-2">Confirm Deletion</h3>
          <p className="py-4">Are you sure you want to delete it?</p>
          
          <div className="modal-action">
            <button
              className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
              onClick={onConfirm}
            >
              Yes
            </button>
            <button
              className="btn btn-sm btn-ghost dark:hover:bg-gray-700"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    )
  );
}
