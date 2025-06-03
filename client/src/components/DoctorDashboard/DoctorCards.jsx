import React, { useEffect, useState } from 'react';
import { getDoctorPatients, listAppointments } from '../../services/doctorServices';
import Patients from '../../pages/shared/Patients';
import { useSelector } from 'react-redux';
import BloodBankData from '../../pages/shared/BloodBankData';

const Card = ({ title, value, bgColor, textColor, colSpan = '', onClick, valueSize = 'text-4xl' }) => {
  const isClickable = typeof onClick === 'function';
  return (
    <div className={`w-[200px] min-h-[100px] px-8 p-6 rounded-2xl shadow-lg text-center flex flex-col justify-center ${bgColor} ${textColor} ${colSpan} ${isClickable ? 'cursor-pointer hover:opacity-90' : ''}`}
      onClick={onClick}
    >
      <h3 className="text-xl md:text-2xl font-semibold mb-2">{title}</h3>
      <div className={`${valueSize} font-extrabold break-words`}>{value}</div>
    </div>
  )
};

const DoctorCards = ({ onBloodBankClick }) => {
  const doctorData = useSelector((state) => state.doctor?.doctor?.doctorExist);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchPatients();

  }, []);

  const fetchAppointments = () => {
    listAppointments()
      .then((res) => {
        console.log('Fetched appointments:', res);
        setAppointments(res || []);
        console.log(res);

      })
      .catch((err) => {
        console.error('Error fetching departments:', err);
        setAppointments([]);
      });
  };


  const fetchPatients = () => {
    getDoctorPatients()
      .then((res) => {
        console.log('Fetched patients are:', res);
        setPatients(res || []);
        console.log(res);

      })
      .catch((err) => {
        console.error('Error fetching patients:', err);
        setPatients([]);
      });
  };


  return (
    <>
      <div className="grid grid-cols-1  justify-items-center md:grid-cols-2 lg:grid-cols-4 gap-14 mb-2  ">
        <Card
          title="Total Appointments"
          value={appointments.length}
          bgColor="bg-blue-500"
          textColor="text-white"
          colSpan="lg:col-span-1"
        />
        <Card
          title="Total Patients"
          value={patients.length}
          bgColor="bg-cyan-500"
          textColor="text-white"
          colSpan="lg:col-span-1"
        />

        <Card
          title="Blood Bank"
          value="Check blood group availability"
          bgColor="bg-[#0967C2]"
          textColor="text-white"
          colSpan="lg:col-span-1"
          valueSize="text-sm"
          onClick={() => setIsModalOpen(true)}
        />
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-5xl  max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Blood Bank Information</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="modal-bloodbank-slim W-[100px]">
              <BloodBankData />
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default DoctorCards;
