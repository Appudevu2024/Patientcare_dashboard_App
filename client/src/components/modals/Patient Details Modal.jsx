import React from 'react';

export default function PatientDetailsModal({ isOpen, onClose, patient }) {
  if (!patient) return null;

  const formattedTime = patient.appointment?.time
    ? new Date(`1970-01-01T${patient.appointment.time}`).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : 'N/A';

const getStatusMessage = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "Patient is currently under doctor care.";
    case "finished":
    case "completed":
      return "Treatment completed; patient is no longer under care.";
    case "quit":
      return "Treatment stopped before completion.";
    case "transferred":
      return "Transferred to another doctor/department.";
    case "cancelled":
      return "Appointment was cancelled.";
    default:
      return "Pending.";
  }
};

  return (
    <>
      {isOpen && (
        <dialog id="patient_modal" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-3xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold mb-4 p-3 bg-red-600 text-white rounded-md">
              Patient Details
            </h3>

            <div className="space-y-2 text-sm sm:text-base">
              <p><strong className="text-blue-600 dark:text-blue-400">Name:</strong> {patient.name}</p>
              <p><strong className="text-blue-600 dark:text-blue-400">Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString('en-GB')}</p>
              <p><strong className="text-blue-600 dark:text-blue-400">Contact:</strong> {patient.contact}</p>
              <p><strong className="text-blue-600 dark:text-blue-400">Doctor:</strong> {patient.doctor?.name || 'N/A'}</p>
              <p><strong className="text-blue-600 dark:text-blue-400">Date:</strong> {patient.appointment?.date ? new Date(patient.appointment.date).toLocaleDateString('en-GB') : 'N/A'}</p>
              <p><strong className="text-blue-600 dark:text-blue-400">Time:</strong> {formattedTime}</p>

              {/* Vitals Section */}
              <div className="mt-4">
                <h4 className="font-semibold text-blue-600 dark:text-blue-400">Vitals</h4>
                {patient.vitals ? (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Height: {patient.vitals.height || 'N/A'} cm</li>
                    <li>Weight: {patient.vitals.weight || 'N/A'} kg</li>
                    <li>Blood Pressure: {patient.vitals.bloodPressure || 'N/A'} mm Hg</li>
                    <li>Temperature: {patient.vitals.temperature || 'N/A'} °F</li>
                    <li>Pulse Rate: {patient.vitals.pulseRate || 'N/A'} bpm</li>
                    <li>Respiration Rate: {patient.vitals.respirationRate || 'N/A'} b/min</li>
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No vitals recorded.</p>
                )}
              </div>

              {/* Prescriptions Section */}
              <div className="mt-4">
                <h4 className="font-semibold text-blue-600 dark:text-blue-400">Prescriptions</h4>
                {patient.prescriptions && patient.prescriptions.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {patient.prescriptions.map((prescription, index) => {
                      const text = prescription.prescription?.trim().toLowerCase();
                      if (!text || ['none', 'no medicine needed..', 'not visited', 'nill', 'not', 'closed', 'quit'].includes(text)) {
                        return null;
                      }
                      return (
                        <li key={index}>
                          <span className="font-medium">{new Date(prescription.date).toLocaleString('en-GB')}</span>:<br />
                          {prescription.prescription}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No prescriptions available.</p>
                )}
              </div>

              {/* Status */}
              <p className="mt-4">
                <strong className="text-blue-600 dark:text-blue-400">Status:</strong> {getStatusMessage(patient.status)}
              </p>
            </div>

            <div className="modal-action mt-6">
              <button
                className="btn bg-red-600 text-white hover:bg-red-700 transition rounded-md px-6"
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
