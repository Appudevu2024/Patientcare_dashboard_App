// import { useNavigate, useParams } from 'react-router-dom';
// import React, { useState, useContext, useEffect } from 'react';
// import { doctorDetails, doctorUpdation, listDepartment } from '../../services/adminServices';
// import { toast } from 'react-toastify';
// import { ThemeContext } from '../../context/ThemeContext';
// import { X } from 'lucide-react';

// export default function DoctorUpdtaion() {
//   const theme = useContext(ThemeContext);
//   const [departments, setDepartments] = useState([]);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [values, setValues] = useState({
//     name: '', email: '', password: '', dateOfBirth: '',
//     contact: '', qualification: '', gender: '',
//     department: '', availableDays: '', address: '',
//     timings: '', imageFile: null,
//   });

//   useEffect(() => {
//     listDepartment()
//       .then(res => setDepartments(res || []))
//       .catch(err => {
//         console.error('Failed to load departments', err);
//         setDepartments([]);
//       });
//   }, []);

//   useEffect(() => {
//     const fetchDoctorDetails = async () => {
//       try {
//         const res = await doctorDetails(id);
//         const doctor = res.doctorExist;
//         if (!doctor) {
//           toast.error('Doctor not found');
//           return;
//         }

//         setValues({
//           name: doctor.name || '', email: doctor.email || '',
//           password: doctor.password || '',
//           dateOfBirth: doctor.dob ? new Date(doctor.dob).toISOString().split('T')[0] : '',
//           contact: doctor.contact || '', qualification: doctor.qualification || '',
//           gender: doctor.gender || '', department: doctor.department || '',
//           availableDays: doctor.availableDays || '',
//           address: doctor.address || '', timings: doctor.timings || '',
//           imageFile: null,
//         });
//       } catch (error) {
//         console.error('Error fetching doctor data:', error);
//         toast.error('Failed to load doctor details');
//       }
//     };

//     fetchDoctorDetails();
//   }, [id]);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       Object.entries(values).forEach(([key, value]) => {
//         if (key === 'imageFile' && value) formData.append('image', value);
//         else formData.append(key, value);
//       });

//       formData.append('_id', id);

//       await doctorUpdation(formData);
//       toast.success('Doctor updated successfully!', { position: 'top-center' });
//       navigate('/adminpanel?tab=doctors');
//     } catch (error) {
//       const message = error.response?.data?.message || 'Failed updation';
//       toast.error(message, { position: 'top-center' });
//       console.error('Update error:', error);
//     }
//   };

//   return (
//     <div className={` py-10 px-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
//      <div className="w-full max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative">
//   {/* Close Button */}
//   <button
//     onClick={() => navigate('/adminpanel?tab=doctors')}
//     className="btn btn-sm btn-circle absolute top-4 right-4 text-red-600 bg-transparent hover:bg-red-100 dark:hover:bg-red-800"
//     title="Close"
//     type="button"
//   >
//     <X size={18} />
//   </button>

//   <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
//     Update Doctor
//   </h2>
//   <div className="h-1 bg-[#0967C2] my-2 w-40 mx-auto"></div>

//   <form className="space-y-4" onSubmit={onSubmit}>
         
//           <div className="flex flex-col gap-y-2">
           
//             <label className="label">
//               <span className="label-text text-gray-800 dark:text-white">Name</span>
//             </label>
//             <input type="text" name="name" className="input input-bordered w-full "
//               value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} required />
//           </div>

//           <div className="flex flex-col gap-y-2">
//             <label><span className="label-text text-gray-800 dark:text-white">Email</span></label>
//             <input type="email" name="email" className="input input-bordered w-full "
//               value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} required />
//           </div>

//           <div className="flex flex-col gap-y-2">
//             <label>
//              <span className="label-text text-gray-800 dark:text-white">Password</span>
//             </label>
//             <input type="password" name="password" className="input input-bordered w-full "
//               value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} />
//           </div>

//           <div className="flex flex-col gap-y-2">
//             <label>
//               <span className="label-text text-gray-800 dark:text-white">Date of Birth</span>
//             </label>
//             <input type="date" name="dateOfBirth" className="input input-bordered w-full "
//               value={values.dateOfBirth} onChange={(e) => setValues({ ...values, dateOfBirth: e.target.value })} required />
//           </div>

//           <div className="flex flex-col gap-y-2">
//             <label>
//               <span className="label-text text-gray-800 dark:text-white">Qualification</span>
//             </label>
//             <input type="text" name="qualification" className="input input-bordered w-full "
//               value={values.qualification} onChange={(e) => setValues({ ...values, qualification: e.target.value })} />
//           </div>

//           <div className="flex flex-col gap-y-2">
//             <label>
//               <span className="label-text text-gray-800 dark:text-white">Contact</span>
//             </label>
//             <input type="tel" name="contact" className="input input-bordered w-full "
//               value={values.contact} onChange={(e) => setValues({ ...values, contact: e.target.value })} required />
//           </div>

//           <div className="flex flex-col gap-y-2">
//             <label>
//               <span className="label-text text-gray-800 dark:text-white">Gender</span>
//             </label>
//             <div className="flex gap-4 dark:text-white">
//               {['male', 'female', 'others'].map((g) => (
//                 <label key={g} className="flex items-center gap-1">
//                   <input type="radio" name="gender" value={g} className="radio checked:bg-blue-500 dark:text-white"
//                     checked={values.gender === g} onChange={(e) => setValues({ ...values, gender: e.target.value })} />
//                   <span className="capitalize">{g}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div className="flex flex-col gap-y-2">
//             <label>
//               <span className="label-text text-gray-800 dark:text-white">Department</span>
//             </label>
//             <select name="department" className="select select-bordered w-full "
//               value={values.department} onChange={(e) => setValues({ ...values, department: e.target.value })} required>
//               <option disabled value="">Choose a department</option>
//               {departments.map((dept) => (
//                 <option key={dept._id} value={dept.name}>{dept.name}</option>
//               ))}
//             </select>
//           </div>

//           <div className="flex flex-col gap-y-2">
//             <label>
//               <span className="label-text text-gray-800 dark:text-white">Available Days</span>
//             </label>
//             <input type="text" name="availableDays" className="input input-bordered w-full "
//               value={values.availableDays} onChange={(e) => setValues({ ...values, availableDays: e.target.value })} />
//           </div>

//           <div className="flex flex-col gap-y-2">
//             <label>
//               <span className="label-text text-gray-800 dark:text-white">Address</span>
//             </label>
//             <textarea name="address" className="textarea textarea-bordered w-full " rows={3}
//               value={values.address} onChange={(e) => setValues({ ...values, address: e.target.value })} />
//           </div>

//           <div className="flex flex-col gap-y-2">
//             <label>
//               <span className="label-text text-gray-800 dark:text-white">Timings</span>
//             </label>
//             <input type="text" name="timings" className="input input-bordered w-full "
//               value={values.timings} onChange={(e) => setValues({ ...values, timings: e.target.value })} required />
//           </div>

//           <div className="flex flex-col gap-y-2">
//             <label>
//               <span className="label-text text-gray-800 dark:text-white">Image</span>
//             </label>
//             <input type="file" name="image" accept="image/*" className="file-input file-input-bordered w-full " 
//               onChange={(e) => setValues({ ...values, imageFile: e.target.files[0] })} />
//           </div>

//           <button type="submit" className="btn bg-[#0967C2] text-white w-full mt-4">Update</button>
//         </form>
//       </div>
//     </div>
//   );
// }
