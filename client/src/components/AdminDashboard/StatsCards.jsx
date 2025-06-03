
import React, { useEffect, useState } from 'react';
import { getAllPatients, listAppointments, listDepartment } from '../../services/adminServices';
import { listDoctors } from '../../services/loginServices';

const Card = ({ title, value, bgColor, textColor }) => (
  <div className={`w-full min-h-[150px] px-6 py-4 rounded-2xl shadow-md text-center flex flex-col justify-center  ${bgColor} ${textColor}`}>
   <h3 className="text-lg md:text-xl font-semibold mb-1 break-words max-w-full">{title}</h3>

    <p className="text-3xl md:text-4xl font-extrabold">{value}</p>
  </div>
);

const StatsCards = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [department, setDepartment] = useState([]);

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
    fetchDepartment();
  }, []);

  const fetchAppointments = () => {
    listAppointments()
      .then((res) => setAppointments(res || []))
      .catch((err) => {
        console.error('Error fetching appointments:', err);
        setAppointments([]);
      });
  };

  const fetchPatients = () => {
    getAllPatients()
      .then((res) => setPatients(res || []))
      .catch((err) => {
        console.error('Error fetching patients:', err);
        setPatients([]);
      });
  };

  const fetchDoctors = () => {
    listDoctors()
      .then((res) => setDoctors(res || []))
      .catch((err) => {
        console.error('Error fetching doctors:', err);
        setDoctors([]);
      });
  };

  const fetchDepartment = () => {
    listDepartment()
      .then((res) => setDepartment(res || []))
      .catch((err) => {
        console.error('Error fetching departments:', err);
        setDepartment([]);
      });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <Card
        title="Total Appointments"
        value={appointments.length}
        bgColor="bg-blue-500"
        textColor="text-white"
      />
      <Card
        title="Total Patients"
        value={patients.length}
        bgColor="bg-cyan-500"
        textColor="text-white"
      />
      <Card
        title="Total Doctors"
        value={doctors.length}
        bgColor="bg-purple-500"
        textColor="text-white"
      />
      <Card
        title="Total Departments"
        value={department.length}
        bgColor="bg-[#0967C2]"
        textColor="text-white"
      />
    </div>
  );
};

export default StatsCards;
