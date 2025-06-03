import axiosInstance from "../axios/axiosinstance";


export const listAppointments = async () => {
  try {
    const res = await axiosInstance.get('/doctor/appointments');
    console.log('Appointments :', res.data);

    if (Array.isArray(res.data)) {
      return res.data; 
    } else {
      console.warn('Unexpected   response:', res.data);
      return []; 
    }
  } catch (error) {
    console.error('Error in Appointment data:', error);
    throw error;
  }
};  

export const getDoctorPatients = async () => {
  try {
    const res = await axiosInstance.get('/doctor/patients/by-doctor');
    return res.data.patients || [];
  } catch (error) {
    console.error('Error fetching doctor patients:', error);
    throw error;
  }
};

export const getPatientById = async (id) => {
  try {
    const res = await axiosInstance.get(`/doctor/patients/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching patient data:', error);
    throw error;
  }
};


export const addPrescription = async (patientId, prescription) => {
  try {
    const res = await axiosInstance.post(`/doctor/patients/prescriptions/${patientId}`, {
      prescription,
    });
    return res.data;
  } catch (error) {
    console.error('Error adding prescription:', error);
    throw error;
  }
};

export const updatePatientStatus = async (patientId, newStatus) => {
  try {
    const res = await axiosInstance.put(`/doctor/patients/${patientId}/status`, {
      status: newStatus,
    });
    return res.data;
  } catch (error) {
    console.error('Error updating patient status:', error);
    throw error;
  }
};