import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { getAllPatients } from '../../services/staffServices';
import { Link } from 'react-router-dom';
import { usePatientContext } from '../../context/PatientContext';

export default function StaffPatients({ showAddVitals, onAddVitalsClick = () => { } }) {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const { vitalsAddedPatients } = usePatientContext();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    getAllPatients().then(setPatients).catch(console.error);
  }, []);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.doctor?.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };


  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const [hourStr, minute] = timeString.split(':');
    let hour = parseInt(hourStr, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${suffix}`;
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold dark:text-white">Patients</h2>
        <input
          type="text"
          placeholder="Search by patient/doctor"
          className="input input-bordered w-full md:w-72 dark:bg-gray-800 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="table w-full text-sm">
          <thead className="bg-[#0967C2] text-white dark:bg-blue-800">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2 text-left">Patient Name</th>
              <th className="p-2">DOB</th>
              <th className="p-2">Contact</th>
              <th className="p-2 text-left">Consulting Doctor</th>
              <th className="p-2">Date</th>
              <th className="p-2">Time</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 dark:text-white">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient, idx) => (
                <tr key={patient._id} className="border-t dark:border-gray-700">
                  <td className="p-2 text-center">{idx + 1}</td>
                  <td className="p-2">{patient.name}</td>
                  <td className="p-2">{new Date(patient.dateOfBirth).toLocaleDateString('en-GB')}</td>
                  <td className="p-2">{patient.contact || 'N/A'}</td>
                  <td className="p-2">{patient.doctor?.name || 'Unknown'}</td>
                  <td className="p-2">{new Date(patient.appointment?.date).toLocaleDateString('en-GB')}</td>
                  <td className="p-2">
                    {formatTime(patient.appointment?.time)}
                  </td>
                  <td className="p-2">
                    <span
                      className={`badge ${vitalsAddedPatients.includes(patient._id) || (patient.vitals && Object.keys(patient.vitals).length > 0)
                        ? 'badge-success'
                        : 'badge-warning'
                        }`}
                    >
                      {/* {(vitalsAddedPatients.includes(patient._id) || (patient.vitals && Object.keys(patient.vitals).length)) ? 'Completed' : 'Pending'} */}
                      {
                        vitalsAddedPatients.includes(patient._id) || (patient.vitals && Object.keys(patient.vitals).length > 0)
                          ? 'Completed'
                          : 'Pending'
                      }
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleView(patient)}
                        className="btn btn-sm  btn-circle btn-ghost text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
                      >
                        <Eye size={16} />
                      </button>
                      {/* {patient.status === 'completed' ? (
                        <button
                          className="btn btn-xs text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          disabled
                        >
                          Vitals Added
                        </button>
                      ) : (
                        <Link
                          to={`/staffpanel/patientdetails/${patient._id}`}
                          className={`btn btn-xs underline text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900`}
                          disabled={vitalsAddedPatients.includes(patient._id)}
                        >
                          Add Vitals
                        </Link>
                      )} */}
                      {showAddVitals && (
                        vitalsAddedPatients.includes(patient._id) || (patient.vitals && Object.keys(patient.vitals).length > 0) ? (
                          <button
                            className="btn btn-xs text-gray-400 dark:text-gray-500 cursor-not-allowed"
                            disabled
                          >
                            Vitals Added
                          </button>
                        ) : (
                          <button
                            onClick={() => onAddVitalsClick(patient._id)}
                            className="btn btn-xs underline text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900"
                          >
                            Add Vitals
                          </button>
                        )
                      )}

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center p-4">
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {isModalOpen && selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-lg relative">
              <h3 className="text-xl font-bold mb-4 text-[#0967C2]">Patient Details</h3>
              <div className="space-y-2 text-sm dark:text-gray-200">
                <p><strong>Name:</strong> {selectedPatient.name}</p>
                <p><strong>DOB:</strong> {new Date(selectedPatient.dateOfBirth).toLocaleDateString('en-GB')}</p>
                <p><strong>Contact:</strong> {selectedPatient.contact || 'N/A'}</p>
                <p><strong>Consulting Doctor:</strong> {selectedPatient.doctor?.name || 'Unknown'}</p>
                <p><strong>Date:</strong> {new Date(selectedPatient.appointment?.updatedAt).toLocaleDateString('en-GB')}</p>
                <p><strong>Time:</strong> {formatTime(selectedPatient.appointment?.time) || 'N/A'}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-3 text-gray-500 dark:text-gray-300 hover:text-red-500"
              >
                ✕
              </button>
              <div className="mt-4 text-right">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );

};


