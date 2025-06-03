import React from 'react';

export default function AppointmentModal({ isOpen, onClose, appointment }) {
  if (!appointment) return null;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-GB');

  const formatTime = (timeStr) => {
    const [hourStr, minute] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${suffix}`;
  };

  return (
    <>
      {isOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl p-0 overflow-hidden dark:bg-gray-900 dark:text-white">
            {/* Header */}
          <div className="px-6 py-3 text-lg font-bold text-center text-[#0967C2] dark:text-white dark:bg-gray-800">
              Appointment Details
            </div>

            {/* Content */}
            <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <p><strong>Patient:</strong> {appointment.patientname}</p>
              <p><strong>DOB:</strong> {formatDate(appointment.dateOfBirth)}</p>
              <p><strong>Contact:</strong> {appointment.contact}</p>
              <p><strong>Doctor:</strong> {appointment.doctor?.name || 'Unknown'}</p>
              <p><strong>Date:</strong> {formatDate(appointment.date)}</p>
              <p><strong>Time:</strong> {formatTime(appointment.time)}</p>
              <p><strong>Status:</strong> {appointment.status}</p>
            </div>

            {/* Actions */}
            <div className="modal-action px-6 py-4">
              <button
                className="btn bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 w-full sm:w-auto"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
