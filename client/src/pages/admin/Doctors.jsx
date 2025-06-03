import React, { useEffect, useState } from 'react';
import { listDoctors } from '../../services/loginServices';
import DoctorRegistration from './DoctorRegistration';
import { Eye, Pencil, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { deleteDoctor } from '../../services/adminServices';
import { toast } from 'react-toastify';
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const navigate = useNavigate();

  const handleView = (doctor) => {
    navigate(`/adminpanel/doctors/doctorDetails/${doctor._id}`);
  };

  const handleEdit = (doctor) => {
    navigate(`/adminpanel/doctorUpdation/${doctor._id}`);
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
      await deleteDoctor(deleteId);
      toast.success('Doctor deleted');
      fetchDoctors();
    } catch (error) {
      console.error('Deletion error:', error);
    } finally {
      closeDeleteModal();
    }
  };


  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = () => {
    listDoctors()
      .then((res) => setDoctors(res || []))
      .catch((err) => {
        console.error('Error fetching doctors:', err);
        setDoctors([]);
      });
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(search.toLowerCase()) ||
    doctor.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
   <div className="p-4 md:px-8 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
    <div className="mb-4 flex flex-wrap justify-between items-center gap-4">

        <h2 className="text-xl font-bold">
          Doctors&nbsp;&nbsp;
          {!showForm ? (
            <span
              className="text-blue-600 text-sm cursor-pointer hover:underline"
              onClick={() => setShowForm(true)}
            >
              Add New
            </span>
          ) : (
            <span
              className="text-gray-400 text-sm cursor-pointer hover:underline"
              onClick={() => {
                setShowForm(false);
                fetchDoctors();
              }}
            >
              Back to List
            </span>
          )}
        </h2>

        {!showForm && (
          <input
            type="text"
            placeholder="Search by name or email"
            className="input input-bordered w-full sm:w-72 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
      </div>

      {showForm ? (
        <DoctorRegistration
          onCancel={() => {
            setShowForm(false);
            setEditingDoctor(null); // reset edit state
          }}
          onSuccess={() => {
            fetchDoctors();
            setEditingDoctor(null); // reset after successful update
          }}
          doctor={editingDoctor} // pass the doctor to be edited
        />
      ) : (
    <div className="w-full overflow-x-auto rounded-lg shadow-md bg-white dark:bg-gray-800">
  <table className="min-w-[800px] w-full text-sm sm:text-base table-auto">
            <thead className="bg-[#0967C2] dark:bg-gray-700 text-white">
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Contact</th>
                <th>Qualification</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor, index) => (
                  <tr key={doctor._id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="avatar">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src={doctor.image || 'https://via.placeholder.com/150'}
                            alt="Doctor"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    </td>
                    <td>{doctor.name}</td>
                    <td>{doctor.email}</td>
                    <td>{doctor.gender}</td>
                    <td>{doctor.contact}</td>
                    <td>{doctor.qualification}</td>
                    <td>{doctor.department}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          className="btn btn-sm  btn-circle btn-ghost text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
                          onClick={() => handleView(doctor)}
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-circle btn-ghost text-green-500 hover:bg-green-100 dark:hover:bg-green-900"
                          onClick={() => {
                            setEditingDoctor(doctor);
                            setShowForm(true); // show form inline
                          }}
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="btn btn-sm btn-circle btn-ghost text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                          onClick={() => openDeleteModal(doctor._id)}
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
                  <td colSpan="9" className="text-center py-4">
                    No doctors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      )}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
