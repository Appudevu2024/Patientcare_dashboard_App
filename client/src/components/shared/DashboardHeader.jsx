import { Link, useNavigate } from 'react-router-dom';
import logo from '../../images/hospital-logo.avif';
import React, { useEffect, useContext } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { adminLogout, doctorLogout, staffLogout } from '../../services/loginServices';
import { persistor } from '../../redux/store';
import { clearAdmin } from '../../redux/features/adminSlice';
import { clearDoctor } from '../../redux/features/doctorSlice';
import { clearStaff } from '../../redux/features/staffSlice';
import { ThemeContext } from '../../context/ThemeContext';

function DashboardHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const adminData = useSelector((state) => state.admin?.adminExist);
  //console.log(adminData);
  const doctorData = useSelector((state) => state.doctor.doctorExist);
  //console.log("🧩 Doctor Data from Redux:", doctorData);
  const staffData = useSelector((state) => state.staff.staffExist);
  console.log(adminData);
  console.log(doctorData);
  console.log("🧩 Staff Data from Redux:", staffData);

  let loggedInUser = null;
  if (adminData?._id) {
    loggedInUser = { name: 'Admin', role: 'Admin', image: adminData.image };
  } else if (doctorData?._id) {
    loggedInUser = { name: doctorData.name || 'Doctor', role: 'Doctor', image: doctorData.image || 'dummy-female-img.webp' };
  } else if (staffData?._id) {
    loggedInUser = { name: staffData.name || 'Staff', role: 'Staff', image: staffData.image || 'dummy-female-img.webp' };
  }

  const handleLogout = async () => {
    try {
      if (adminData?.email) {
        await adminLogout();
        dispatch(clearAdmin());
      } else if (doctorData?.doctorExist?._id) {
        await doctorLogout();
        dispatch(clearDoctor());
      } else if (staffData?.staffExist?._id) {
        await staffLogout();
        dispatch(clearStaff());
      }

      ['Admin_token', 'Doctor_token', 'Staff_token'].forEach(cookieName => {
        document.cookie = `${cookieName}=; path=/; max-age=0`;
      });
      // await persistor.purge();
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="w-full bg-white shadow dark:bg-gray-900">
      <div className="w-full px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Logo + Brand */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Hospital Logo" className="h-10 w-10 rounded-full object-cover" />
          <span className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">HealthCare</span>
        </div>

        {/* Center Welcome */}
        <div className="text-center sm:flex-1">
          <span className="text-lg sm:text-l font-semibold text-gray-700 dark:text-gray-200">
            Welcome {loggedInUser ? loggedInUser.name : ''}
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-lg p-2 border rounded-full border-gray-300 dark:border-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* User Info + Logout */}
          {loggedInUser && (
            <div className="flex items-center gap-2">
              {/* <img
                // src={loggedInUser?.image}
                src={`/images/${loggedInUser?.image ||'Admin_img.avif'}`}
                alt="User"
                className="w-10 h-10 sm:w-16 sm:h-16 object-cover rounded-full shadow-md"
              /> */}
              <img
                // src={loggedInUser?.image || '/images/Admin_img.avif'}
                src={loggedInUser?.image.startsWith('http') ? loggedInUser.image : `/images/${loggedInUser.image}`}
                alt="User"
                className="w-10 h-10 sm:w-16 sm:h-16 object-cover rounded-full shadow-md"
              />
              <button
                onClick={handleLogout}
                className="bg-[#0967C2] text-white hover:bg-blue-700 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
