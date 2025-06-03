import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useContext, useEffect } from 'react';
import { doctorRegister, listDepartment, updateDoctor } from '../../services/adminServices';
import { toast } from 'react-toastify';
import { ThemeContext } from '../../context/ThemeContext';
import { X } from 'lucide-react';

export default function DoctorRegistration({ onCancel, onSuccess, doctor }) {
  const theme = useContext(ThemeContext);
   const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    qualification: '',
    dateOfBirth: '',
    contact: '',
    gender: '',
    department: '',
    availableDays: '',
    address: '',
    timings: '',
    imageFile:  '',
  });

  useEffect(() => {
    if (doctor) {
      setValues({
        name: doctor.name || '',
        email: doctor.email || '',
        password: doctor.password || '',
        qualification: doctor.qualification || '',
        dateOfBirth: doctor.dob ? doctor.dob.slice(0, 10) : '',
        contact: doctor.contact || '',
        gender: doctor.gender || '',
        department: doctor.department || '',
        availableDays: doctor.availableDays || '',
        address: doctor.address || '',
        timings: doctor.timings || '',
        imageFile: null
      });
    }
  }, [doctor]);

  useEffect(() => {
    listDepartment()
      .then(res => setDepartments(res || []))
      .catch(err => {
        console.error('Failed to load departments', err);
        setDepartments([]);
      });
  }, []);


  const onSubmit = async (e) => {
    e.preventDefault();
   
   const nameRegex = /^[A-Za-z.\s]{2,40}$/;
    if (!nameRegex.test(values.name.trim())) {
      return toast.error("Name must be 2-40 characters long and contain only letters and spaces.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email.trim())) {
      return toast.error("Please enter a valid email address.");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dob = new Date(values.dateOfBirth);
    if (dob > today) {
      return toast.error("Date of birth cannot be in the future.", { position: 'top-center' });
    }
    // Password: min 6 characters, must include uppercase, number, special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|\\:;"'<>,.?/~`]).{6,}$/;
    if (!passwordRegex.test(values.password)) {
      return toast.error(
        "Password must be at least 6 characters and include an uppercase letter, number, and special character."
      );
    }
    const contactStr = String(values.contact);
           if (!/^\d{8,15}$/.test(contactStr)) {
             return toast.error('Contact must be 8 to 15 digits.');
           }

    const formData = new FormData();
    Object.entries({
      name: values.name,
      email: values.email,
      password: values.password,
      qualification: values.qualification,
      dob: values.dateOfBirth,
      gender: values.gender,
      contact: values.contact,
      address: values.address,
      department: values.department,
      availableDays: values.availableDays,
      timings: values.timings,
    }).forEach(([key, val]) => formData.append(key, val));
    formData.append('image', values.imageFile);

    try {
      if (doctor) {

        await updateDoctor(doctor._id, formData);
        toast.success('Updated successfully', { position: 'top-center' });
      } else {
        await doctorRegister(formData);
        console.log(formData);
        toast.success('Saved successfully', { position: 'top-center' });
      }

      onSuccess?.();
      onCancel?.();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Operation failed', {
        position: 'top-center',
      });
    }
  }

  return (
    <div className="flex justify-center items-center p-4 bg-gray-100 dark:bg-gray-900">
    <div className="relative card w-full md:max-w-2xl shadow-xl bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6">

        <div className="flex justify-center items-center mb-6">
          <h2 className="text-xl font-bold text-[#0967C2] dark:text-[#66a3ff] text-center mt-4">
            {doctor ? 'Update Doctor' : 'Register Doctor'}
          </h2>
          {/* Close Button */}
          <button
            onClick={onCancel}
            className="btn btn-sm btn-circle absolute right-4 top-4  text-blue dark:bg-red-500 dark:hover:bg-red-600"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="h-1 bg-[#0967C2] dark:bg-[#66a3ff] mb-6 rounded mx-auto w-40" />

       <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Name', name: 'name', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Password', name: 'password', type: 'password' },
            { label: 'Date Of Birth', name: 'dateOfBirth', type: 'date' },
            { label: 'Contact', name: 'contact', type: 'tel' },
            { label: 'Qualification', name: 'qualification', type: 'text' },
            { label: 'Available Days', name: 'availableDays', type: 'text' },
            { label: 'Timings', name: 'timings', type: 'text' },
          ].map(({ label, name, type }) => (
            <div key={name} className="w-full col-span-1 space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{label}</label>
              <input
                type={type}
                name={name}
                className="input input-bordered w-full bg-white dark:bg-gray-700 dark:text-white "
                required
                value={values[name]}
                onChange={(e) => {
                  let value = e.target.value;
                  if (e.target.name === 'name') {
                    value = value.replace(/[^A-Za-z\s]/g, '');
                  }
                  if (name === 'contact') {
                    value = value.replace(/\D/g, '').slice(0, 15);
                  }
                  setValues((prev) => ({ ...prev, [e.target.name]: value }));
                }}
              />
            </div>
          ))}

          {/* Gender (Full Width) */}
          <div className="w-full col-span-1 space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Gender</label>
          <div className="w-full col-span-1 md:col-span-1 space-y-1">
              {['male', 'female', 'others'].map((gender) => (
                <label key={gender} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    className="radio checked:bg-blue-500 "
                    checked={values.gender === gender}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, gender: e.target.value }))
                    }
                  />
                  <span className="capitalize dark:text-white">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Department */}
        <div className="w-full col-span-1 md:col-span-1 space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Department</label>
            <select
              name="department"
              className="select select-bordered w-full bg-white dark:bg-gray-700 dark:text-white "
              required
              value={values.department}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))
              }
            >
              <option disabled value="">
                Choose a department
              </option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div className="w-full col-span-1 space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Address</label>
            <textarea
              name="address"
              className="textarea textarea-bordered w-full bg-white dark:bg-gray-700 dark:text-white "
              rows={3}
              value={values.address}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, address: e.target.value }))
              }
            />
          </div>

          {/* Image Upload */}
          <div className=" w-full col-span-1 space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="file-input file-input-bordered w-full bg-white dark:bg-gray-700 dark:text-white "
              onChange={(e) =>
                setValues((prev) => ({ ...prev, imageFile: e.target.files[0] }))
              }
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="btn bg-[#0967C2] hover:bg-[#0752a3] text-white w-full mt-4"
            >
              {doctor ? 'Update' : 'Register'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
