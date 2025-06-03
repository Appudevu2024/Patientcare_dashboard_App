import React, { useEffect, useState } from 'react';
import { Eye, Pencil, Trash } from 'lucide-react';
import { listBloodBank,deleteBloodgroup } from '../../services/adminServices';
import AddBloodGroup from '../admin/AddBloodGroup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal';

export default function BloodBankData() {
  const [bloodbank, setBloodbank] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(null);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
   const [viewingBloodbank, setViewingBloodbank] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    
  const handleEdit = (bloodgroup) => {
    setSelectedBloodGroup(bloodgroup);
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
      await deleteBloodgroup(deleteId);
      toast.success('Bloodgroup deleted');
      fetchBloodBank();
    } catch (error) {
      console.error('Deletion error:', error);
    } finally {
      closeDeleteModal();
    }
  };

   const handleView = (bloodgroup) => {
    setViewingBloodbank(bloodgroup);
    setShowViewModal(true);
  };

  useEffect(() => {
    fetchBloodBank();
  }, []);

  const fetchBloodBank = () => {
    listBloodBank()
      .then((res) => {
        setBloodbank(res|| []);
        console.log(res);
        
      })
      .catch((err) => {
        console.error('Error fetching blood bank:', err);
        setBloodbank([]);
      });
  };

  const filteredBloodbank = bloodbank.filter(
    (bloodgroup) =>
      bloodgroup.bloodgroup.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 dark:bg-gray-800 text-gray">
    <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
  <div className="flex flex-wrap items-center gap-2">
    <h2 className="text-lg font-semibold">
      BloodBank
    </h2>
    {!showForm ? (
      <span
        className="text-blue-600 text-sm cursor-pointer"
        onClick={() => {
          setSelectedBloodGroup(null);
          setShowForm(true);
        }}
      >
        Add New
      </span>
    ) : (
      <span
        className="text-gray-500 text-sm cursor-pointer"
        onClick={() => setShowForm(false)}
      >
        <span className="underline">Back to List</span>
      </span>
    )}
  </div>

  {!showForm && (
    <input
      type="text"
      placeholder="Search by blood group"
      className="input input-bordered w-full sm:w-72 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  )}
</div>

      {showForm ? (
       <AddBloodGroup
        bloodGroupToEdit={selectedBloodGroup}
          onCancel={() => {
            setShowForm(false)
            fetchBloodBank();
          }}
          onSuccess=      
            {fetchBloodBank}
         />
      ) : (
        <>
         <div className="overflow-x-auto dark:bg-gray-800 text-gray">
            <table className="table-lg dark:bg-gray-800">
              <thead className="bg-[#0967C2] text-white dark:bg-gray-800 text-gray-800 dark:text-white">
                <tr>
                  <th>#</th>
                  <th>Blood Group</th>
                  <th>No. of Bags available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBloodbank.length > 0 ? (
                  filteredBloodbank.map((bloodgroup, index) => (
                    <tr key={bloodgroup._id}>
                      <td>{index + 1}</td>
                      <td>{bloodgroup.bloodgroup}</td>
                      <td>{bloodgroup.noofbagsavailable}</td>
                      <td className="flex items-center space-x-2">
                        <button
                          className="btn btn-sm btn-ghost text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
                          onClick={() => handleView(bloodgroup)}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="btn btn-sm btn-ghost text-green-500 hover:bg-green-100 dark:hover:bg-green-900"
                          onClick={() => handleEdit(bloodgroup)}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          className="btn btn-sm btn-ghost text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                          onClick={() => openDeleteModal(bloodgroup._id)}
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No details found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
      {showViewModal && viewingBloodbank && (
              <dialog id="BloodbankViewModal" className="modal modal-open">
                <div className="modal-box dark:bg-gray-800 dark:text-white">
                  <h3 className="font-bold text-lg text-[#0967C2]  mb-4">Bloodbank Data</h3>
                  <div className="space-y-2">
                    <p><strong>Bloodgroup:</strong> {viewingBloodbank.bloodgroup}</p>
                    <p><strong>No of Bags available:</strong> {viewingBloodbank.noofbagsavailable}</p>
                  </div>
                  <div className="modal-action">
                    <button
                      className="btn bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 w-full sm:w-auto"
                      onClick={() => {
                        setShowViewModal(false);
                        setViewingBloodbank(null);
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
