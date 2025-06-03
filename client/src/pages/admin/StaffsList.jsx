import React, { useEffect, useState } from 'react';
import { Eye, Pencil, Trash } from 'lucide-react';
import { toast } from 'react-toastify';
import { createStaff, deleteStaff, listAllStaffs } from '../../services/staffServices';
import StaffCreation from './StaffCreation';
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal';

export default function StaffLists() {
  const [staffs, setStaffs] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [viewingStaff, setViewingStaff] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = () => {
    listAllStaffs()
      .then((res) => setStaffs(res || []))
      .catch((err) => {
        console.error('Error fetching staff:', err);
        setStaffs([]);
      });
  };

  const handleView = (staff) => {
    setViewingStaff(staff);
    setShowViewModal(true);
  };
  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setShowForm(true);
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
      await deleteStaff(deleteId);
      toast.success('Staff deleted');
      fetchStaffs();
    } catch (error) {
      console.error('Deletion error:', error);
    } finally {
      closeDeleteModal();
    }
  };

  const filteredStaffs = staffs.filter(
    (staff) =>
      staff.name.toLowerCase().includes(search.toLowerCase()) ||
      staff.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-semibold">
            Staffs &nbsp;&nbsp;
            {showForm ? (
              <span
                className="text-gray-500b text-sm underline cursor-pointer"
                onClick={() => {
                  setShowForm(false);
                  setSelectedStaff(null);
                  fetchStaffs();
                }}
              >
                Back to List
              </span>
            ) : (
              <span
                className="text-blue-600 text-sm underline cursor-pointer"
                onClick={() => setShowForm(true)}
              >
                Add New
              </span>
            )}
          </h2>

          {!showForm && (
            <input
              type="text"
              placeholder="Search by name or email"
              className="input input-bordered w-full sm:w-72 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
        </div>

        {/* Form or Table */}
        {showForm ? (
          <StaffCreation
            staffToEdit={selectedStaff}
            onCancel={() => {
              setShowForm(false);
              setSelectedStaff(null);
            }}
            onSuccess={() => {
              fetchStaffs();
              setShowForm(false);
              setSelectedStaff(null);
            }}
          />
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-[#0967C2] text-white dark:bg-gray-700">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Gender</th>
                  <th className="p-3 text-left">Contact</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Address</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaffs.length > 0 ? (
                  filteredStaffs.map((staff, index) => (
                    <tr key={staff._id} className="border-b dark:border-gray-700">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src={staff.image || 'https://via.placeholder.com/150'}
                            alt={staff.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-3">{staff.name}</td>
                      <td className="p-3">{staff.email}</td>
                      <td className="p-3">{staff.gender}</td>
                      <td className="p-3">{staff.contact}</td>
                      <td className="p-3">{staff.staffrole}</td>
                      <td className="p-3">{staff.address}</td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <button
                            className="btn btn-sm  btn-circle btn-ghost text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
                            onClick={() => handleView(staff)}
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className="btn btn-sm  btn-circle btn-ghost text-green-500 hover:bg-green-100 dark:hover:bg-green-900"
                            onClick={() => handleEdit(staff)}
                          >
                            <Pencil size={18} />
                          </button>
                          {/* <button
                            className=" btn btn-sm  btn-circle btn-ghost text-red-500 hover:bg-red-100 dark:hover:bg-red-900 "
                            onClick={() => handleDelete(staff._id)}
                          >
                            <Trash size={18} />
                          </button> */}
                          <button
                            className="btn btn-sm btn-circle btn-ghost text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                            onClick={() => openDeleteModal(staff._id)}
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
                    <td colSpan="9" className="text-center p-4">
                      No staff found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showViewModal && viewingStaff && (
        <dialog id="staffViewModal" className="modal modal-open">
          <div className="modal-box dark:bg-gray-800 dark:text-white">
            <h3 className="font-bold text-lg text-[#0967C2]  mb-4">Staff Details</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {viewingStaff.name}</p>
              <p><strong>Email:</strong> {viewingStaff.email}</p>
              <p><strong>Contact:</strong> {viewingStaff.contact}</p>
              <p><strong>DOB:</strong> {new Date(viewingStaff.dob).toLocaleDateString()}</p>
              <p><strong>Address:</strong> {viewingStaff.address}</p>
              <p><strong>Role:</strong> {viewingStaff.staffrole}</p>
            </div>
            <div className="modal-action">
              <button
                className="btn bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 w-full sm:w-auto"
                onClick={() => {
                  setShowViewModal(false);
                  setViewingStaff(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
