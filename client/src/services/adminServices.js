
import axiosInstance from "../axios/axiosinstance"

export const doctorRegister = async (formData) => {
  try {
    const res = await axiosInstance.post('/doctor/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('Error in Doctor registration:', error);
    throw error;
  }
};

export const doctorDetails = async (id) => {
  try {

    const res = await axiosInstance.post('/doctor/doctorDetails', { _id:id});
    console.log('Doctordetails :', res.data); 
    return res.data; 
  } catch (err) {
    console.error('Error fetching doctor details:', err);
    throw err;
  }
}

export const updateDoctor = async (doctorId, formData) => {
  try {
    const res = await axiosInstance.put(`/doctor/updateDoctor/${doctorId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('Error in Doctor updation:', error);
    throw error;
  }
};

export const deleteDoctor = async (id) => {
  try {
    const res = await axiosInstance.delete('/doctor/deleteDoctor',{ data: { _id: id } });
    return res.data;
  } catch (err) {
    console.error("Error in doctor deletion:", err);
    throw err;
  }
};

export const addBloodGroup = async (values) => {
  try {
    const res = await axiosInstance.post('/admin/addBloodGroup', values, {
      withCredentials: true,
    });
    console.log(res.data)
    return res.data;
  } catch (error) {
    console.error('Error occured:', error);
    throw error;
  }
};

export const listBloodBank = async () => {
  try {
    const res = await axiosInstance.get('/admin/listBloodBank');
    console.log('BloodBankData :', res.data);

    if (res.data && res.data.bloodgroups) {
      return res.data.bloodgroups;
    } else {
      console.warn('Unexpected blood bank response:', res.data);
      return []; 
    }
  } catch (error) {
    console.error('Error in BloodBankData:', error);
    throw error;
  }
};

export const deleteBloodgroup = async (id) => {
  try {
    const res = await axiosInstance.delete('/admin/deleteBloodgroup',{ data: { _id: id } });
    return res.data;
  } catch (err) {
    console.error("Error in bloodgroup deletion:", err);
    throw err;
  }
};

export const updateBloodbank = async (data) => {
  try{
  const res = await axiosInstance.put('/admin/updateBloodbank', data,{
    withCredentials:true,
  });
  return res.data;
} catch (error) {
    console.error('Error in bloodgroup updation:', error);
    throw error;
  }
};

export const addDepartment = async (values) => {
  try {
    const res = await axiosInstance.post('/admin/addDepartment', values, {
      withCredentials: true,
    });
    console.log(res.data)
    return res.data;
  } catch (error) {
    console.error('Error occured:', error);
    throw error;
  }
};

export const listDepartment = async () => {
  try {
    const res = await axiosInstance.get('/admin/listDepartment');
    console.log('Departments :', res.data);

    if (res.data && res.data.departments) {
      return res.data.departments;
    } else {
      console.warn('Unexpected   response:', res.data);
      return []; 
    }
  } catch (error) {
    console.error('Error in Department data:', error);
    throw error;
  }
};
export const deleteDepartment = async (id) => {
  try {
    const res = await axiosInstance.delete('/admin/deleteDepartment',{ data: { _id: id } });
    return res.data;
  } catch (err) {
    console.error("Error in department deletion:", err);
    throw err;
  }
};

export const updateDepartment = async (data) => {
  try{
  const res = await axiosInstance.put('/admin/updateDepartment', data, {
    withCredentials: true,
  });
  return res.data;
} catch (error) {
    console.error('Error in department updation:', error);
    throw error;
  }
};

export const listAppointments = async () => {
  try {
    const res = await axiosInstance.get('/admin/appointments');
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

export const bookAppointment = async (data) => {
  try {
    const res = await axiosInstance.post('/admin/appointments', data, {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true,
    });
    console.log(res.data)
    return res.data;
  } catch (error) {
    console.error('Error occured:', error);
    throw error;
  }
};

export const updateAppointment = async (data) => {
  try{
  const res = await axiosInstance.put('/admin/appointments', data, {
    withCredentials: true,
  });
  return res.data;
} catch (error) {
    console.error('Error in appointment updation:', error);
    throw error;
  }
};


export const deleteAppointment = async (id) => {
  try {
    const res = await axiosInstance.delete('/admin/appointments',{ data: { _id: id } });
    return res.data;
  } catch (err) {
    console.error("Error in department deletion:", err);
    throw err;
  }
};

export const getAppointmentById = async (id) => {
  try {
    const res = await axiosInstance.get(`/admin/appointments/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching appointment by ID:", error);
    throw error;
  }
};


export const getAllPatients = async () => {
  try {
    const res = await axiosInstance.get('/admin/patients');
    console.log('Patients :', res.data);

    if (res.data && Array.isArray(res.data.patients)) {
      return res.data.patients; 
    } else {
      console.warn('Unexpected   response:', res.data);
      return []; 
    }
  } catch (error) {
    console.error('Error in Patients data:', error);
    throw error;
  }
};

export const deletePatient = async (id) => {
  try {
    const res = await axiosInstance.delete('/admin/patients',{ data: { _id: id } });
    return res.data;
  } catch (err) {
    console.error("Error in patient deletion:", err);
    throw err;
  }
};



