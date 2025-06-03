import React, { useEffect, useState } from 'react';
import { listAppointments } from '../../services/doctorServices';

export default function DoctorAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await listAppointments();
        setAppointments(res || []);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.patientname?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="text-center text-lg py-6 dark:text-white">Loading appointments...</div>;
  }

  return (
    <div className="overflow-x-auto w-full mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-bold dark:text-white">Your Appointments</h2>
        <input
          type="text"
          placeholder="Search by patient"
          className="input input-bordered w-full sm:w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="table table-md w-full text-sm">
          <thead className="bg-[#0967C2] text-white">
            <tr>
              <th>#</th>
              <th>Patient Name</th>
              <th>DOB</th>
              <th>Contact</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="dark:text-white">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((apt, idx) => (
                <tr key={apt._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td>{idx + 1}</td>
                  <td>{apt.patientname}</td>
                  <td>{new Date(apt.dateOfBirth).toLocaleDateString('en-GB')}</td>
                  <td>{apt.contact}</td>
                  <td>{new Date(apt.date).toLocaleDateString('en-GB')}</td>
                  <td>
                    {apt.time
                      ? (() => {
                          const [hourStr, minute] = apt.time.split(':');
                          let hour = parseInt(hourStr, 10);
                          const suffix = hour >= 12 ? 'PM' : 'AM';
                          hour = hour % 12 || 12;
                          return `${hour}:${minute} ${suffix}`;
                        })()
                      : 'N/A'}
                  </td>
                  <td>{apt.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
