
import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

function Footer() {
  const { theme } = useContext(ThemeContext);

  return (
    <footer
      className={`footer flex flex-col sm:flex-wrap md:flex-row md:justify-between gap-10 px-6 py-10 
      ${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-base-200 text-base-content'}`}
    >
      {/* Services */}
      <nav className="w-full sm:w-[45%] md:w-auto">
        <h6 className="footer-title">Services</h6>
        <ul className="space-y-1">
          <li className="link link-hover">Maternity Care</li>
          <li className="link link-hover">24 Hours Emergency</li>
          <li className="link link-hover">24 Hours Pharmacy</li>
          <li className="link link-hover">Best Radiology</li>
          <li className="link link-hover">Medical Laboratory</li>
        </ul>
      </nav>

      {/* Departments */}
      <nav className="w-full sm:w-[50%] md:w-auto">
        <h6 className="footer-title">Departments</h6>
        <ul className="grid grid-cols-2 sm:grid-cols-2 gap-x-8 gap-y-1">
          <li className="link link-hover">Obstetrics & Gynecology</li>
          <li className="link link-hover">Dermatology</li>
          <li className="link link-hover">Cardiology</li>
          <li className="link link-hover">General Surgery</li>
          <li className="link link-hover">Internal Medicine</li>
          <li className="link link-hover">Orthopedics</li>
          <li className="link link-hover">Pediatrics</li>
          <li className="link link-hover">Emergency Dept.</li>
          <li className="link link-hover">Neurology</li>
          <li className="link link-hover">Urology</li>
        </ul>
      </nav>

      {/* Newsletter */}
      <form className="w-full sm:w-full md:w-80">
        <h6 className="footer-title">Newsletter</h6>
        <fieldset>
          <label className="label">
            <span className="label-text">Enter your email address</span>
          </label>
          <div className="join w-full">
            <input
              type="email"
              placeholder="username@mail.com"
              className="input input-bordered join-item w-full dark:bg-gray-800 dark:border-gray-600"
            />
            <button
              type="submit"
              className="btn join-item bg-blue-700 hover:bg-blue-800 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Subscribe
            </button>
          </div>
        </fieldset>
      </form>
    </footer>
  );
}

export default Footer;
