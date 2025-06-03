import React, { useEffect, useState } from 'react';
import { Eye, Pencil, Trash } from 'lucide-react';
import { deleteDepartment, listDepartment } from '../../services/adminServices';
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddDepartments from './AddDepartments';

export default function Departments() {
  const [department, setDepartment] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const [viewingDept, setViewingDept] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);


  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setShowForm(true);
  };

 const handleView = (department) => {
    setViewingDept(department);
    setShowViewModal(true);
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
      await deleteDepartment(deleteId);
      toast.success('Department deleted');
      fetchDepartment();
    } catch (error) {
      console.error('Deletion error:', error);
    } finally {
      closeDeleteModal();
    }
  };

  

  useEffect(() => {
    fetchDepartment();
  }, []);

  const fetchDepartment = () => {
    listDepartment()
      .then((res) => {
        setDepartment(res || []);
      })
      .catch((err) => {
        console.error('Error fetching departments:', err);
        setDepartment([]);
      });
  };

  const filteredDepartment = department.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 dark:bg-gray-900 min-h-screen">
      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Departments &nbsp;&nbsp;
          {!showForm ? (
            <span
              className="ml-4 text-blue-600 dark:text-blue-400 text-sm cursor-pointer hover:underline"
              onClick={() => {
                setSelectedDepartment(null);
                setShowForm(true);
              }}
            >
              Add New
            </span>
          ) : (
            <span
              className="ml-4 text-gray-500 text-sm cursor-pointer hover:underline"
              onClick={() => setShowForm(false)}
            >
              Back to List
            </span>
          )}
        </h2>
        {!showForm && (
          <input
            type="text"
            placeholder="Search by dept name or desc."
            className="input input-bordered w-full sm:w-72 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
      </div>

      {showForm ? (
        <AddDepartments
          departmentToEdit={selectedDepartment}
          onCancel={() => {
            setShowForm(false);
            fetchDepartment();
          }}
          onSuccess={fetchDepartment}
        />
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-[#0967C2] dark:bg-gray-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartment.length > 0 ? (
                filteredDepartment.map((department, index) => (
                  <tr key={department._id} className="border-b dark:border-gray-600">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{department.name}</td>
                    <td className="px-4 py-3 max-w-sm whitespace-normal break-words">
                      {department.description}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                          onClick={() => handleView(department)}
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="text-green-500 hover:text-green-700 dark:hover:text-green-300"
                          onClick={() => handleEdit(department)}
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
                          onClick={() => openDeleteModal(department._id)}
                          title="Delete"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center px-4 py-6 text-gray-600 dark:text-gray-400">
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
        {showViewModal && viewingDept && (
        <dialog id="DeptViewModal" className="modal modal-open">
          <div className="modal-box dark:bg-gray-800 dark:text-white">
            <h3 className="font-bold text-lg text-[#0967C2]  mb-4">Department Details</h3>
            <div className="space-y-2">
              <p><strong>Department Name:</strong> {viewingDept.name}</p>
              <p><strong>Description:</strong> {viewingDept.description}</p>
            </div>
            <div className="modal-action">
              <button
                className="btn bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 w-full sm:w-auto"
                onClick={() => {
                  setShowViewModal(false);
                  setViewingDept(null);
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
