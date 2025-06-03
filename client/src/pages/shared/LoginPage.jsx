
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { LoginContext } from '../../context/LoginContext';
import { adminLogin, doctorLogin, staffLogin } from '../../services/loginServices';
import { saveAdmin } from '../../redux/features/adminSlice';
import { saveDoctor } from '../../redux/features/doctorSlice';
import { saveStaff } from '../../redux/features/staffSlice';
import { ThemeContext } from '../../context/ThemeContext';

function LoginPage() {
  const { setShowLogin } = useContext(LoginContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [values, setValues] = useState({ email: '', password: '' });
  const [role, setRole] = useState('admin');

  const onSubmit = async () => {
    try {
      let loginFn, redirectPath;
      if (role === 'admin') {
        loginFn = adminLogin;
        redirectPath = '/adminpanel';
      } else if (role === 'doctor') {
        loginFn = doctorLogin;
        redirectPath = '/doctorpanel';
      } else {
        loginFn = staffLogin;
        redirectPath = '/staffpanel';
      }

      const data = await loginFn(values);
      if (role === 'admin') dispatch(saveAdmin(data.user));
      if (role === 'doctor') dispatch(saveDoctor(data.user));
      if (role === 'staff') dispatch(saveStaff(data.user));

      toast.success(`${role} login successful`, { position: 'top-center' });
      setTimeout(() => navigate(redirectPath), 100);
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Login failed', {
        position: 'top-center',
      });
    }
  };

  return (
   <div className="flex items-center justify-center bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 py-10 sm:py-16 overflow-auto">
  <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 space-y-2 transition-all duration-300">
    <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 dark:text-blue-400">Login</h2>

    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-5"
    >
      {/* Role Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Login as</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="select select-bordered w-full bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
        >
          <option value="admin">Admin</option>
          <option value="doctor">Doctor</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
        <input
          type="email"
          name="email"
          placeholder="example@email.com"
          className="input input-bordered w-full bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
          required
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          className="input input-bordered w-full bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
          required
        />
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          className="btn w-full bg-blue-700 hover:bg-blue-800 text-white dark:bg-blue-600 dark:hover:bg-blue-500 transition-all duration-200"
        >
          Login
        </button>
      </div>
    </form>
  </div>
</div>

  );
}

export default LoginPage;
