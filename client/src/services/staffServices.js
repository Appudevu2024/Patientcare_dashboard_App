
import axiosInstance from "../axios/axiosinstance"
export const listAllStaffs = async () => {
    try {
      const res = await axiosInstance.get('/staff/liststaffs');
      console.log('Staffs :', res.data); 
      return res.data.staffs; 
    } catch (error) {
      console.error('Error in liststaffs:', error);
      throw error;
    }
  };
  
//   export const createStaff = async (formData) => {
//     try {
//       const res = await axiosInstance.post('/staff/register', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         },
//         withCredentials: true,
//       });
//       return res.data;
//     } catch (error) {
//       console.error('Error in staff registration:', error);
//       throw error;
//     }
//   };

export const createStaff = async (staffData) => {
    try {
      const res = await axiosInstance.post('/staff/register', staffData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
  
      return res.data;
    } catch (error) {
      console.error("Response error:", error.response?.data || error.message);
      throw error;
    }
  };
  
  
  export const staffDetails = async (id) => {
    try {
  
      const res = await axiosInstance.post('/staff/staffDetails', { _id:id});
      console.log('staffDetails:', res.data); 
      return res.data; 
    } catch (err) {
      console.error('Error fetching staff details:', err);
      throw err;
    }
  }
  
  export const updateStaffdata = async (formData) => {
    try {
      const res = await axiosInstance.put('/staff/updateStaff', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error('Error in Staff updation:', error);
      throw error;
    }
  };
  
  export const deleteStaff = async (id) => {
    try {
      const res = await axiosInstance.delete('/staff/deleteStaff',{ data: { _id: id } });
      return res.data;
    } catch (err) {
      console.error("Error in staff deletion:", err);
      throw err;
    }
  };
  

  export const getAllPatients = async () => {
    try {
      const res = await axiosInstance.get('/staff/patients/by-staff');
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

  
  export const getPatientById = async (id) => {
    try {
      console.log(`Fetching patient with ID: ${id}`);
      const response = await axiosInstance.get(`/staff/patients/${id}`);
      console.log('Full Response:', response); 
      return response;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error('Patient not found');
      } else {
        console.error('Error fetching patient:', error);
      }
      return null;  // Return null if patient not found
    } 
  };
  
  
  // export const updatePatientVitals = async (id, vitals) => {
  //   try {
  //     const res = await axiosInstance.put(`/staff/patients/${id}/vitals`, vitals);
  //     console.log('Updated vitals:', res.data);
  //     return res.data;
  //   } catch (error) {
  //     console.error('Error updating patient vitals:', error);
  //     throw error;
  //   }
  // };
  
  export const updatePatientVitals = async (id, vitals) => {
    try {
      const updatedVitals = {
        ...vitals,
        status: 'completed', // Mark as completed
      };
  
      const res = await axiosInstance.put(`/staff/patients/${id}/vitals`, updatedVitals);
      console.log('Updated vitals:', res.data);
      return res.data;
    } catch (error) {
      console.error('Error updating patient vitals:', error);
      throw error;
    }
  };
  