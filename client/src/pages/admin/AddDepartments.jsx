import React, { useState, useContext, useEffect } from 'react';
import { addDepartment, updateDepartment } from '../../services/adminServices';
import { toast } from 'react-toastify';
import { ThemeContext } from '../../context/ThemeContext';
import { X } from 'lucide-react';

function AddDepartments({ departmentToEdit, onSuccess, onCancel }) {
  const theme = useContext(ThemeContext);

  const [values, setValues] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (departmentToEdit) {
      setValues({
        _id: departmentToEdit._id,
        name: departmentToEdit.name,
        description: departmentToEdit.description,
      });
    }
  }, [departmentToEdit]);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      if (departmentToEdit) {
        await updateDepartment(values);
        toast.success('Updated successfully');
      } else {
        const result = await addDepartment(values);
        console.log("Department added:", result);
        toast.success('Saved successfully');
      }

      setValues({ name: '', description: '' });

      if (onSuccess) onSuccess();
      if (onCancel) onCancel();
    } catch (err) {
      console.error(err);
      toast.error('Action failed. Please try again.', { position: 'top-center' });
    }
  };

  return (
    <div className="w-full flex justify-center px-4">
      <div className="card w-full max-w-xl shadow-xl dark:bg-gray-800 dark:text-white relative p-6">

        {/* Header with Close button aligned to the right */}
        <div className="flex justify-between items-center text-center mb-4">
          <h2 className="text-2xl font-bold ">
            Department {departmentToEdit ? 'Updation' : 'Creation'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-600"
            title="Close"
          >
            <X size={20} className="text-red-600 dark:text-white" />
          </button>
        </div>

        <div className="h-1 bg-[#0967C2] my-2 w-48 mx-auto rounded"></div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4 mt-6">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name of Dept."
              required
              value={values.name}
              onChange={(e) => {
                const { name, value } = e.target;
                const onlyLetters = value.replace(/[0-9]/g, '');
                setValues((prev) => ({ ...prev, [name]: onlyLetters }));
              }}
              className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0967C2]"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Description</label>
            <textarea
              name="description"
              rows={3}
              required
              placeholder="Dept. description"
              value={values.description}
              onChange={(e) => {
                const { name, value } = e.target;
                const onlyLetters = value.replace(/[0-9]/g, '');
                setValues((prev) => ({ ...prev, [name]: onlyLetters }));
              }}
              className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0967C2]"
            ></textarea>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#0967C2] hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              {departmentToEdit ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDepartments;
