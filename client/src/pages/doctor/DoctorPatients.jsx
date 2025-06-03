import React, { useEffect, useState } from 'react';
import { getDoctorPatients, getPatientById, updatePatientStatus } from '../../services/doctorServices';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash } from 'lucide-react';
import AddPrescription from './AddPrescription';

export default function DoctorPatients({onAddPresClick=()=>{}}) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [showAddPrescription, setShowAddPrescription] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  useEffect(() => {
    getDoctorPatients()
      .then((data) => {
        setPatients(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch patients:', err);
        setLoading(false);
      });
  }, []);

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };
  const handleEdit = (patient) => {
    navigate(`/doctorpanel/add-prescription/${patient._id}`, {
      state: { patient },
    });
  };

  // const handleAddPrescription = (patientId) => {
  //   setSelectedPatientId(patientId);
  //   setShowAddPrescription(true);
  // };

  const handleStatusChange = async (patientId, newStatus) => {
    try {
      console.log(patientId)
      await updatePatientStatus(patientId, newStatus);
      setPatients((prev) =>
        prev.map((p) => (p._id === patientId ? { ...p, status: newStatus } : p))
      );
    } catch (error) {
      console.error('Failed to update patient status', error);
    }
  };
  const filteredPatients = patients.filter(
    (patient) =>

      patient.name.toLowerCase().includes(search.toLowerCase())
  );
  if (loading) return <div>Loading patient data...</div>;
  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold mb-4">Your Patients</h2>
        <input
          type="text"
          placeholder="Search patients by name "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered mb-4 w-full max-w-xs"
        />
      </div>
      <table className="table table-zebra w-full">
        <thead className="bg-[#0967C2] text-white">
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Contact</th>
            <th>Vitals</th>
            <th>Action</th>
            <th>#</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient) => (
            <tr key={patient._id}>
              <td>{patient.name}</td>
              <td>{patient?.appointment?.date ? new Date(patient.appointment.date).toLocaleDateString('en-GB') : 'N/A'}</td>
              <td>{patient.contact}</td>
              <td>
                {patient.vitals ? (
                  <p><strong>Vitals recorded</strong></p>
                ) : (
                  <span>No vitals recorded</span>
                )}
              </td>

              <td>
                {patient.prescriptions && patient.prescriptions.length > 0 ? (
                  <button
                    className="btn btn-sm btn-ghost text-gray-400 cursor-not-allowed"
                    disabled
                  >
                    Prescription Added
                  </button>
                ) : patient.vitals ? (
                  <button
                    onClick={() => handleEdit(patient)}
                    className="btn btn-sm btn-ghost text-blue-500 underline"
                  >
                    Add Prescription
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-ghost text-gray-400 cursor-not-allowed"
                    disabled
                  >
                    Add Vitals First
                  </button>
                )}

              </td>

              <td className="flex gap-2 mt-8">
                <button className="btn btn-xs btn-ghost text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900" onClick={() => handleView(patient)}>
                  <Eye size={16} />
                </button>
                {/* <button className="btn btn-sm btn-ghost text-green-500 hover:bg-green-100 dark:hover:bg-green-900" onClick={() => handleEdit(patient)}>
                  <Pencil size={16} />
                </button> */}
                <button
                  className={`btn btn-sm btn-ghost ${patient.status !== 'Active'
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-green-500 hover:bg-green-100 dark:hover:bg-green-900'
                    }`}
                  onClick={() => patient.status === 'Active' && handleEdit(patient)}
                  disabled={patient.status !== 'Active'}
                >
                  <Pencil size={16} />
                </button>
              </td>
              <td>
                <select
                  className={`select select-bordered text-sm sm:text-base px-3 py-2 rounded-md min-w-[140px] max-w-full ${patient.status !== 'Active'
                      ? 'text-gray-500 bg-gray-100 cursor-not-allowed'
                      : 'text-black'
                    }`}
                  value={patient.status || 'Active'}
                  onChange={(e) => handleStatusChange(patient._id, e.target.value)}
                  disabled={patient.status !== 'Active'}          >
                  <option value="Active">Active</option>
                  <option value="Finished">Finished</option>
                  <option value="Quit">Quit</option>
                  <option value="Transferred">Transferred</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#0967C2] mb-4">Patient Details</h3>
            <p><strong>Name: </strong> {selectedPatient.name}</p>
            <p><strong>DOB: </strong> {new Date(selectedPatient.dateOfBirth).toLocaleDateString('en-GB')}</p>
            <p><strong>Contact: </strong> {selectedPatient.contact}</p>
            <p><strong>Visited Date: </strong> {selectedPatient?.appointment?.date ? new Date(selectedPatient.appointment.date).toLocaleDateString('en-GB') : 'N/A'}</p>

            {/* <p><strong>Status:</strong> {selectedPatient.status}</p> */}
            {selectedPatient.vitals ? (
              <>
                <p><strong>Height: </strong> {selectedPatient.vitals.height || 'N/A'} cm</p>
                <p><strong>Weight: </strong> {selectedPatient.vitals.weight || 'N/A'} kg</p>
                <p><strong>BP: </strong> {selectedPatient.vitals.bloodPressure || 'N/A'} mm Hg</p>
                <p><strong>Temp: </strong> {selectedPatient.vitals.temperature || 'N/A'} °F</p>
                <p><strong>Pulse: </strong> {selectedPatient.vitals.pulseRate || 'N/A'} bpm</p>
                <p><strong>RR: </strong> {selectedPatient.vitals.respirationRate || 'N/A'} b/min</p>
                <p><strong>Diag: </strong> {selectedPatient.vitals.diagnostic}</p>
              </>
            ) : (
              <p><strong>Vitals:</strong> Not recorded</p>
            )}
            {selectedPatient.prescriptions?.length > 0 ? (
              <div>
                <h4 className="font-semibold text-lg text-blue-600">Latest Prescription:</h4>
                <p>{selectedPatient.prescriptions[selectedPatient.prescriptions.length - 1].prescription}</p>
              </div>
            ) : (
              <p>No prescriptions available</p>
            )}
            <div className="mt-4 text-right">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
