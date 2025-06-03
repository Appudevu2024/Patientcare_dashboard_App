import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BloodBankData from '../../pages/shared/BloodBankData';
import { getAllPatients } from '../../services/staffServices';

const Card = ({ title, value, bgColor, textColor, colSpan = '', onClick, valueSize = 'text-4xl' }) => {
  const isClickable = typeof onClick === 'function';

  return (
    <div
      className={`min-h-[100px] px-6 py-4 rounded-2xl shadow-lg text-center justify-center ${bgColor} ${textColor} ${colSpan} ${isClickable ? 'cursor-pointer hover:opacity-90 transition' : ''}`}
      onClick={onClick}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className={`${valueSize} font-extrabold break-words`}>{value}</div>
    </div>
  );
};

const Staffcard = ({ onBloodBankClick }) => {
  const staffData = useSelector((state) => state.staff?.staff?.staffExist);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    getAllPatients()
      .then((res) => {
        setPatients(res || []);
      })
      .catch((err) => {
        console.error('Error fetching patients:', err);
        setPatients([]);
      });
  };

  return (
    <>
      <div className="flex justify-center items-center bg-base-200 dark:bg-gray-900 p-6">
        <div className="flex flex-wrap gap-6 justify-center max-w-xl w-full">
          <Card
            title="Total Patients"
            value={patients.length}
            bgColor="bg-[#0967C2]"
            textColor="text-white"
            colSpan="flex-1 min-w-[240px]"
          />
          <Card
            title="Blood Bank"
            value={<u>Check blood group availability</u>}
            bgColor="bg-white dark:bg-gray-800"
            textColor="text-[#0967C2] dark:text-white"
            colSpan="flex-1 min-w-[240px]"
            valueSize="text-sm"
            onClick={() => {
              setIsModalOpen(true);
              if (onBloodBankClick) onBloodBankClick();
            }}
          />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg max-w-5xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Blood Bank Information</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="modal-bloodbank-slim">
              <BloodBankData />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Staffcard;
