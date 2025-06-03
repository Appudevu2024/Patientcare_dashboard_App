import React, { useEffect, useState } from 'react';
import { Eye, Trash } from 'lucide-react';
import { deletePatient, getAllPatients } from '../../services/adminServices';
import { toast } from 'react-toastify';
import PatientDetailsModal from '../../components/modals/Patient Details Modal';
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal';

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = () => {
        getAllPatients()
            .then((res) => {
                const sorted = (res || []).sort((a, b) => new Date(b.date) - new Date(a.date));
                setPatients(sorted);
            })
            // .then((res) => {
            //     setPatients(res || []);
            // })
            .catch((err) => {
                console.error('Error fetching patients:', err);
                setPatients([]);
            });
    };

    const openDeleteModal = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setDeleteId(null);
        setShowDeleteModal(false);
    };

    const confirmDelete = async () => {
        try {
            await deletePatient(deleteId);
            toast.success('Patient deleted');
            fetchPatients();
        } catch (error) {
            console.error('Deletion error:', error);
        } finally {
            closeDeleteModal();
        }
    };

    const handleView = (patient) => {
        setSelectedPatient(patient);
        setShowModal(true);
    };

    const filteredPatients = patients.filter(
        (patient) =>
        (patient.name.toLowerCase().includes(search.toLowerCase()) ||
            patient.doctor?.name.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="p-4 dark:bg-gray-900 min-h-screen">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Patients</h2>
                <input
                    type="text"
                    placeholder="Search by name or doctor"
                    className="input input-bordered w-full sm:w-72 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto rounded-lg shadow-sm bg-white dark:bg-gray-800">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-[#0967C2] dark:bg-gray-700 text-white">
                        <tr>
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Patient</th>
                            <th className="px-4 py-3">DOB</th>
                            <th className="px-4 py-3">Contact</th>
                            <th className="px-4 py-3">Doctor</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Time</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800 dark:text-gray-100">
                        {filteredPatients.length > 0 ? (
                            filteredPatients.map((patient, idx) => (
                                <tr key={patient._id} className={patient.status === 'completed' ? 'opacity-100' : ''}>
                                    <td className="px-4 py-2">{idx + 1}</td>
                                    <td className="px-4 py-2">{patient.name}</td>
                                    <td className="px-4 py-2">
                                        {patient.dateOfBirth
                                            ? new Date(patient.dateOfBirth).toLocaleDateString('en-GB')
                                            : 'N/A'}
                                    </td>
                                    <td className="px-4 py-2">{patient.contact || 'N/A'}</td>
                                    <td className="px-4 py-2">{patient.doctor?.name || 'Unknown'}</td>
                                    <td className="px-4 py-2">
                                        {patient.appointment?.date
                                            ? new Date(patient.appointment.date).toLocaleDateString('en-GB')
                                            : 'N/A'}
                                    </td>
                                    <td className="px-4 py-2">
                                        {patient.appointment?.time
                                            ? (() => {
                                                const [hourStr, minute] = patient.appointment.time.split(':');
                                                let hour = parseInt(hourStr, 10);
                                                const suffix = hour >= 12 ? 'PM' : 'AM';
                                                hour = hour % 12 || 12;
                                                return `${hour}:${minute} ${suffix}`;
                                            })()
                                            : 'N/A'}
                                    </td>
                                    <td className="px-4 py-2 flex gap-2">
                                        <button
                                            className="btn btn-xs btn-ghost text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
                                            onClick={() => handleView(patient)}
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            className="btn btn-xs btn-ghost text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                                            onClick={() => openDeleteModal(patient._id)}
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center px-4 py-6 text-gray-500 dark:text-gray-400">
                                    No patients found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <PatientDetailsModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                patient={selectedPatient}
            />
            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onCancel={closeDeleteModal}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
