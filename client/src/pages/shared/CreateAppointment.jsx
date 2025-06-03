import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listDoctors } from '../../services/loginServices';
import { bookAppointment, updateAppointment, getAppointmentById } from '../../services/adminServices';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

const CreateAppointment = ({ onClose, appointment }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientname: '',
    dateOfBirth: '',
    contact: '',
    doctor: '',
    date: '',
    time: '',
    status: '',
  });

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(!!id);
  const isEditMode = !!appointment || !!id;

  useEffect(() => {
    if (appointment) {
      setFormData({
        _id: appointment._id,
        patientname: appointment.patientname,
        dateOfBirth: new Date(appointment.dateOfBirth).toISOString().split('T')[0],
        contact: appointment.contact,
        doctor: appointment.doctor._id,
        date: new Date(appointment.date).toISOString().split('T')[0],
        time: appointment.time,
        status: appointment.status,
      });
      setLoading(false);
    }
  }, [appointment]);



  useEffect(() => {
    listDoctors()
      .then((res) => setDoctors(res || []))
      .catch((err) => {
        console.error('Error fetching doctors:', err);
        setDoctors([]);
      });
  }, []);

  useEffect(() => {
    if (id) {
      getAppointmentById(id)
        .then((res) => {
          setFormData({
            _id: res._id,
            patientname: res.patientname,
            dateOfBirth: new Date(res.dateOfBirth).toISOString().split('T')[0],
            contact: res.contact,
            doctor: res.doctor._id,
            date: new Date(res.date).toISOString().split('T')[0],
            time: res.time,
            status: res.status,
          });
        })
        .catch((err) => {
          console.error('Failed to load appointment:', err);
          toast.error("Failed to load appointment data.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dob = new Date(formData.dateOfBirth);
    if (dob > today) {
      return toast.error("Date of birth cannot be in the future.");
    }

    // const appointmentDateTime = new Date(`${formData.date}T${formData.time}`);
    // const now = new Date();
    // if (appointmentDateTime < now) {
    //   return toast.error("Appointment date and time cannot be in the past.");
    // }
    const appointmentDateTime = new Date(`${formData.date}T${formData.time}`);
    const now = new Date();
    const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000); // now + 1 day

    if (appointmentDateTime < now) {
      return toast.error("Appointment date and time cannot be in the past.");
    }
    if (appointmentDateTime > oneDayLater) {
      return toast.error("Appointment date cannot exceed one day from today.");
    }

    const contactStr = String(formData.contact);
    if (!/^\d{8,15}$/.test(contactStr)) {
      return toast.error('Contact must be 8 to 15 digits.');
    }

    try {
      const submissionData = { ...formData };

      if (formData._id) {
        await updateAppointment(submissionData);  // Edit mode
        toast.success('Appointment updated successfully');
      } else {
        await bookAppointment(submissionData);  // Create mode
        toast.success('Appointment created successfully');
      }

      onClose?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit appointment", {
        position: "top-center",
      });
    }
  };

  if (loading) return <p className="text-center dark:text-white">Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <div className="relative card w-full max-w-lg shadow-xl bg-white dark:bg-gray-800 rounded-lg">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-4 top-4  text-blue dark:bg-red-500 dark:hover:bg-red-600"
          title="Close"
        >
          <X size={18} />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold text-center text-[#0967C2] dark:text-[#66a3ff] mb-4">
            {isEditMode ? 'Update Appointment' : 'Create Appointment'}
          </h2>
          <div className="h-1 bg-[#0967C2] dark:bg-[#66a3ff] mb-6 rounded mx-auto w-40" />

          <form className="space-y-5" onSubmit={onSubmit}>

            <label className="label dark:text-gray-200">Patient Name</label>
            <input
              type="text"
              className="input input-bordered w-full bg-white dark:bg-gray-700 dark:text-white"
              value={formData.patientname}

              onChange={(e) => {
                const onlyLettersAndSpaces = e.target.value.replace(/[^A-Za-z\s]/g, '');
                setFormData({ ...formData, patientname: onlyLettersAndSpaces });
              }}
              required
            />

            <label className="label dark:text-gray-200">Date of Birth</label>
            <input
              type="date"
              className="input input-bordered w-full bg-white dark:bg-gray-700 dark:text-white"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              required
            />

            <label className="label dark:text-gray-200">Contact Number</label>
            <input
              type="text"
              className="input input-bordered w-full bg-white dark:bg-gray-700 dark:text-white"
              value={formData.contact}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 15);
                setFormData({ ...formData, contact: digitsOnly });
              }}
              required
            />

            <label className="label dark:text-gray-200">Doctor</label>
            <select
              className="select select-bordered w-full bg-white dark:bg-gray-700 dark:text-white"
              value={formData.doctor}
              onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map(doc => (
                <option key={doc._id} value={doc._id}>{doc.name}</option>
              ))}
            </select>

            <label className="label dark:text-gray-200">Appointment Date</label>
            <input
              type="date"
              className="input input-bordered w-full bg-white dark:bg-gray-700 dark:text-white"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />

            <label className="label dark:text-gray-200">Time</label>
            <input
              type="time"
              className="input input-bordered w-full bg-white dark:bg-gray-700 dark:text-white"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />

            <label className="label dark:text-gray-200">Status</label>
            <select
              className="select select-bordered w-full bg-white dark:bg-gray-700 dark:text-white"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
            >
              <option value="">Select status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button
              type="submit"
              className="btn w-full bg-[#0967C2] hover:bg-[#084a9e] text-white dark:bg-[#66a3ff] dark:hover:bg-[#4480ff]"
            >
              {isEditMode ? 'Update' : 'Create'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAppointment;
