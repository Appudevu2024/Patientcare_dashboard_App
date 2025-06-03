import React, { useState, useContext } from 'react';
import LoginPage from '../shared/LoginPage';
import banner1 from '../../images/slider1.jpg';
import banner2 from '../../images/slider2.webp';
import banner3 from '../../images/slider3.jpg';
import banner4 from '../../images/slider4.jpg';
import { LoginContext } from '../../context/LoginContext';

function HomePage() {
  const { showLogin, setShowLogin } = useContext(LoginContext);

  const banners = [banner1, banner2, banner3, banner4];
  const [currentSlide] = useState(0);

  const handleGetStarted = () => {
    setShowLogin(true);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Carousel */}
      <div className="relative w-full aspect-[3/2] rounded-lg">
        <img
          src={banners[currentSlide]}
          alt={`Banner ${currentSlide + 1}`}
          className="w-full h-full object-cover rounded-lg transition-all duration-500"
          style={{ objectPosition: 'top center' }}
        />

        {/* <div className="absolute top-1/2 transform -translate-y-1/2 left-8 bg-white/10 backdrop-blur-md p-6 rounded-lg text-left max-w-xl">
      <h2 className="text-blue-700 text-2xl md:text-5xl  font-bold mb-8 ml-4 mt-[-20px]">
        Welcome to HealthCare
      </h2>
      <p className="text-gray-700 text-lg  mb-8 max-w-xl  ml-4">
        Your trusted partner in patient care, appointments, and health records.
      </p>
      
    </div> */}
        <div className="absolute inset-0 flex items-center justify-center sm:justify-start px-4 sm:px-8">
          <div className="bg-white/15 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-lg w-full sm:max-w-xl md:max-w-2xl text-center sm:text-left">
            <h2 className="text-blue-700 text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Welcome to HealthCare
            </h2>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
              Your trusted partner in patient care, appointments, and health records.
            </p>
          </div>
        </div>
      </div>
      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-black dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl font-bold"
              aria-label="Close login modal"
            >
              &times;
            </button>
            <LoginPage />
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
