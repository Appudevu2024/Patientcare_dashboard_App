
import React, { useEffect, useState } from 'react';
import { Eye, Pencil, Trash } from 'lucide-react';
import { toast } from 'react-toastify';
import { listAppointments, deleteAppointment } from '../../services/adminServices';
import { useNavigate } from 'react-router-dom';
import AppointmentModal from '../../components/modals/AppointmentModal';
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal';

export default function Appointments({ isDashboard = false, onAddNew, onEdit }) {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    listAppointments()
      .then((res) => { const sorted= (res || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setAppointments(sorted);
  })
      .catch((err) => {
        console.error('Error fetching appointments:', err);
        setAppointments([]);
      });
  };

  const handleEdit = (appointment) => {
    if (typeof onEdit === 'function') {
      onEdit(appointment);
    }
  };
  const handleAddNew = () => {
    if (typeof onAddNew === 'function') {
      onAddNew();
    }
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
      await deleteAppointment(deleteId);
      toast.success('Appointment deleted');
      fetchAppointments();
    } catch (error) {
      console.error('Deletion error:', error);
    } finally {
      closeDeleteModal();
    }
  };

  const handleView = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.doctor?.name?.toLowerCase().includes(search.toLowerCase()) ||
    appointment.patientname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 dark:bg-gray-800 min-h-screen">
      {!isDashboard && (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold dark:text-white">
            Appointments &nbsp;&nbsp;
            <span
              className="text-blue-600  text-sm hover:underline cursor-pointer ml-1"
              onClick={handleAddNew}
            >
              Add New
            </span>
          </h2>
          <input
            type="text"
            placeholder="Search by patient or doctor"
            className="input input-bordered w-full md:w-72 dark:bg-gray-700 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}
 
    <div className="overflow-x-auto rounded-lg shadow-sm bg-white dark:bg-gray-800">
  <table className="min-w-full text-sm text-left table-auto sm:table-fixed">
    <thead className="bg-[#0967C2] dark:bg-gray-700 text-white">
      <tr>
        <th className="px-2 py-3">#</th>
        <th className="px-2 py-3">Patient Name</th>
        <th className="px-2 py-3">DOB</th>
        <th className="px-2 py-3">Contact</th>
        <th className="px-2 py-3">Doctor</th>
        <th className="px-2 py-3">Date</th>
        <th className="px-2 py-3">Time</th>
        <th className="px-2 py-3">Status</th>
        <th className="px-2 py-3 text-center">Actions</th>
      </tr>
    </thead>
    <tbody className="bg-white dark:bg-gray-800 dark:text-white">
      {filteredAppointments.length > 0 ? (
        filteredAppointments.map((appointment, idx) => (
          <tr key={appointment._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="px-2 py-2">{idx + 1}</td>
            <td className="px-2 py-2 whitespace-nowrap">{appointment.patientname}</td>
            <td className="px-2 py-2 whitespace-nowrap">
              {new Date(appointment.dateOfBirth).toLocaleDateString('en-GB')}
            </td>
            <td className="px-2 py-2 whitespace-nowrap">{appointment.contact}</td>
            <td className="px-2 py-2 whitespace-nowrap">{appointment.doctor?.name || 'Unknown'}</td>
            <td className="px-2 py-2 whitespace-nowrap">
              {new Date(appointment.date).toLocaleDateString('en-GB')}
            </td>
            <td className="px-2 py-2 whitespace-nowrap">
              {(() => {
                const [hourStr, minute] = appointment.time.split(':');
                let hour = parseInt(hourStr, 10);
                const suffix = hour >= 12 ? 'PM' : 'AM';
                hour = hour % 12 || 12;
                return `${hour}:${minute} ${suffix}`;
              })()}
            </td>
            <td className="px-2 py-2">{appointment.status}</td>
            <td className="px-2 py-2">
              <div className="flex justify-center gap-2 ">
                <button
                  className="btn btn-sm btn-circle btn-ghost text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
                  onClick={() => handleView(appointment)}
                  title="View"
                >
                  <Eye size={16} />
                </button>
                {!isDashboard && (
                  <button
                    className="btn btn-sm btn-circle btn-ghost text-green-500 hover:bg-green-100 dark:hover:bg-green-900"
                    onClick={() => handleEdit(appointment)}
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                )}
                <button
                  className="btn btn-sm btn-circle btn-ghost text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                  onClick={() => openDeleteModal(appointment._id)}
                  title="Delete"
                >
                  <Trash size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="9" className="text-center py-4 dark:text-gray-300">
            No appointments found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={selectedAppointment}
      />
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>

  );
}
