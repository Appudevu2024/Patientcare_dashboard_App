import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doctorDetails } from '../../services/adminServices';

export default function DoctorDetails() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await doctorDetails(id);
        setDoctor(res.doctorExist);
      } catch (err) {
        console.error('Error fetching doctor details:', err);
      }
    };

    if (id) fetchDoctor();
  }, [id]);

  if (!doctor) return <div className="text-center py-10">Loading doctor details...</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="w-full max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/adminpanel?tab=doctors')}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back
        </button>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center mb-8">Doctor Details</h1>

        {/* Doctor Card */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col md:flex-row gap-6">
          
          {/* Doctor Image */}
          {doctor.image && (
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-64 h-64 object-cover rounded-full shadow-md self-center"
            />
          )}

          {/* Doctor Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">{doctor.name}</h2>
            <p className="mb-1"><strong>Qualification:</strong> {doctor.qualification}</p>
            <p className="mb-1"><strong>Department:</strong> {doctor.department}</p>
            <p className="mb-1"><strong>Email:</strong> {doctor.email}</p>
            <p className="mb-1"><strong>Contact:</strong> {doctor.contact}</p>
            <p className="mb-1"><strong>Available Days:</strong> {doctor.availableDays}</p>
            <p className="mb-1"><strong>Timings:</strong> {doctor.timings}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
