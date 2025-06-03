import React, { useState, useContext, useEffect } from 'react';
import { addBloodGroup, updateBloodbank } from '../../services/adminServices';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ThemeContext } from '../../context/ThemeContext';
import { X } from 'lucide-react';

function AddBloodGroup({ bloodGroupToEdit, onSuccess, onCancel }) {
  const theme = useContext(ThemeContext);
  const navigate = useNavigate();
  const [values, setValues] = useState({
    bloodgroup: '',
    noofbagsavailable: ''
  });
   const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  useEffect(() => {
    if (bloodGroupToEdit) {
      setValues({
        _id: bloodGroupToEdit._id,
        bloodgroup: bloodGroupToEdit.bloodgroup,
        noofbagsavailable: bloodGroupToEdit.noofbagsavailable,
      });
    }
  }, [bloodGroupToEdit]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const bloodGroup = values.bloodgroup.trim().toUpperCase();
      if (!validBloodGroups.includes(bloodGroup)) {
      toast.error('Invalid blood group. Acceptable values: A+, A-, B+, B-, O+, O-, AB+, AB-', {
        position: 'top-center',
      });
      return;
    }
    try {
       const payload = { ...values, bloodgroup: bloodGroup }; 
      if (bloodGroupToEdit) {
        await updateBloodbank(payload);
        toast.success('Updated successfully');
      } else {
        const result = await addBloodGroup(payload);
        console.log("Bloodgroup added:", result);
        toast.success('Saved successfully');
      }

      setValues({
        bloodgroup: '',
        noofbagsavailable: ''
      });

      if (onSuccess) onSuccess();
      if (onCancel) onCancel();

    } catch (err) {
      console.log(err);
      toast.error('Action failed. Please try again.', {
        position: 'top-center'
      });
    }
  };

  return (
     <div className="w-full flex justify-center px-4">
      <div className="card w-full max-w-xl shadow-xl dark:bg-gray-800 dark:text-white relative p-6">

        {/* Header */}
        <div className="flex justify-between items-center text-center mb-4">
          <h2 className="text-2xl font-bold">
            Bloodgroup {bloodGroupToEdit ? 'Updation' : 'Creation'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-600 transition"
            title="Close"
          >
            <X size={20} className="text-red-600 dark:text-white" />
          </button>
        </div>

        <div className="h-1 bg-[#0967C2] my-2 w-48 mx-auto rounded"></div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text dark:text-white">Blood Group</span>
            </label>
            <input
              type="text"
              name="bloodgroup"
              placeholder="e.g., A+, O-"
              className="input input-bordered w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={values.bloodgroup || ''}
              required
              onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text dark:text-white">No. of Bags Available</span>
            </label>
            <input
              type="number"
              name="noofbagsavailable"
              placeholder="e.g., 10"
              className="input input-bordered w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={values.noofbagsavailable || ''}
              required
              onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
            />
          </div>

          <div className="form-control text-center pt-4">
            <button
              type="submit"
              className="btn w-full bg-[#0967C2] text-white hover:bg-blue-700 transition"
            >
              {bloodGroupToEdit ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBloodGroup;
