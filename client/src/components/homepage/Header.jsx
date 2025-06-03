import { Link, useNavigate } from 'react-router-dom';
import logo from '../../images/hospital-logo.avif';
import React, { useContext } from "react";
import { LoginContext } from '../../context/LoginContext';
import { ThemeContext } from '../../context/ThemeContext';

function Header() {
  const { setShowLogin } = useContext(LoginContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
        
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Hospital Logo" className="h-10 w-10 object-cover rounded-full" />
          <span className="text-xl md:text-2xl font-bold text-blue-700 dark:text-white">HealthCare</span>
        </Link>

         {/* Right Actions */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-lg p-2 border rounded-full border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="Toggle Theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* Login Button */}
          <button
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-full transition dark:bg-gray-700 dark:hover:bg-gray-600"
            onClick={() => setShowLogin(true)}
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
