import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { createStaff, updateStaffdata } from '../../services/staffServices';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffCreation = ({ staffToEdit, onSuccess, onCancel }) => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contact: '',
    gender: '',
    dob: '',
    address: '',
    staffrole: '',
    image: null,
  });

  useEffect(() => {
    if (staffToEdit) {
      setFormData({
        _id: staffToEdit._id,
        name: staffToEdit.name,
        email: staffToEdit.email,
        password: staffToEdit.password,
        contact: staffToEdit.contact,
        gender: staffToEdit.gender,
        dob: staffToEdit.dob ? new Date(staffToEdit.dob).toISOString().split('T')[0] : '',
        address: staffToEdit.address,
        staffrole: staffToEdit.staffrole,
        image: staffToEdit.image,
      });
    }
  }, [staffToEdit]);

  const handleImageChange = (e) => {
    // setFormData({ ...formData, image: e.target.files[0] });
    const file = e.target.files[0];

    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

      if (!validImageTypes.includes(file.type)) {
        toast.error('Only JPG, PNG, GIF, or WEBP image files are allowed.');
        return;
      }

      setFormData({ ...formData, image: file });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, contact } = formData;
    //console.log('Validating name:', JSON.stringify(name), 'length:', name.trim().length);
    if (name.trim().length < 2 || name.trim().length > 50) {
      return toast.error('Name must be between 2 and 50 letters.');
    }

    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) submissionData.append(key, value);
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error('Please enter a valid email address.');
    }
    if (!staffToEdit) {
      if (!password || password.length < 6) {
        return toast.error('Password must be at least 6 characters.');
      }
      // Password must have uppercase, lowercase, number, symbol
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
      if (!passwordRegex.test(password)) {
        return toast.error('Password must include uppercase, lowercase, number, and symbol.');
      }
    }

    const contactStr = String(contact);
    if (!/^\d{8,15}$/.test(contactStr)) {
      return toast.error('Contact must be 8 to 15 digits.');
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dob = new Date(formData.dob);
    if (dob > today) {
      return toast.error("Date of birth cannot be in the future.");
    }
    try {
      if (staffToEdit) {
        await updateStaffdata(submissionData);
        toast.success('Updated successfully');
      } else {
        await createStaff(submissionData);
        toast.success('Saved successfully');
      }
      setFormData({
        name: '',
        email: '',
        password: '',
        contact: '',
        gender: '',
        dob: '',
        address: '',
        staffrole: '',
        image: null,
      });
      onSuccess?.();
      onCancel?.();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to save staff';
      toast.error(errorMsg, { position: "top-center" });
    }
  };

  return (
    <div className="w-full flex justify-center px-4">
      <div className="card w-full max-w-xl shadow-xl dark:bg-gray-800 dark:text-white relative">
        <button
          onClick={onCancel}
          className="btn btn-sm btn-circle absolute right-4 top-4 z-10 text-black dark:bg-red-500 dark:hover:bg-red-600"
          title="Close"
        >
          <X size={18} />
        </button>

        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Staff {staffToEdit ? 'Update' : 'Creation'}</h2>
          <div className="h-1 bg-[#0967C2] my-2 w-40 mx-auto rounded"></div>

          <form onSubmit={onSubmit} className="space-y-4 ">
            {/* Name */}
            <div>
              <label className="label-text">Name</label>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full text-black"
                required
                value={formData.name}
                onChange={(e) => {
                  const onlyLettersAndSpaces = e.target.value.replace(/[^A-Za-z\s]/g, '');
                  setFormData({ ...formData, [e.target.name]: onlyLettersAndSpaces })
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="label-text">Email</label>
              <input
                type="email"
                name="email"
                className="input input-bordered w-full text-black "
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              />
            </div>

            {/* Password */}
            <div>
              <label className="label-text">Password</label>
              <input
                type="password"
                name="password"
                className="input input-bordered w-full text-black"
                required={!staffToEdit}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              />
            </div>

            {/* Contact */}
            <div>
              <label className="label-text">Contact</label>
              <input
                type="tel"
                name="contact"
                className="input input-bordered w-full text-black"
                required
                value={formData.contact}
                onChange={(e) => {
                  const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 15);
                  setFormData({ ...formData, contact: digitsOnly });
                }}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="label-text block mb-1">Gender</label>
              <div className="flex gap-4">
                {['male', 'female', 'others'].map((g) => (
                  <label className="flex items-center gap-2 cursor-pointer" key={g}>
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      className="radio checked:bg-blue-500"
                      checked={formData.gender === g}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    />
                    <span className="capitalize">{g}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* DOB */}
            <div>
              <label className="label-text">Date of Birth</label>
              <input
                type="date"
                name="dob"
                className="input input-bordered w-full text-black"
                required
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              />
            </div>

            {/* Address */}
            <div>
              <label className="label-text">Address</label>
              <textarea
                name="address"
                className="textarea textarea-bordered w-full text-black"
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              />
            </div>

            {/* Role */}
            <div>
              <label className="label-text">Staff Role</label>
              <input
                type="text"
                name="staffrole"
                className="input input-bordered w-full text-black"
                required
                value={formData.staffrole}
                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              />
            </div>

            {/* Image */}
            <div>
              <label className="label-text">Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="file-input file-input-bordered w-full text-black"
                onChange={handleImageChange}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-4">
              <button type="submit" className="btn bg-[#0967C2] text-white w-full">
                {staffToEdit ? 'Update Staff' : 'Create Staff'}
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default StaffCreation;
