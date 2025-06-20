import axiosInstance from "../axios/axiosInstance"

// export const adminLogin=async (values)=>{
//   try {
//     const res= await axiosInstance.post('/admin/login', { email, password },{
//       withCredentials: true,
//     });
//     console.log('Admin login response:', res.data); 
//     return res.data;
//   } catch (error) {
//     console.error('Error in login:', error);
//     throw error;
//   }
// }
export const adminLogin = async (values) => {
  try {
    const res = await axiosInstance.post(
      '/admin/login',
     values,
      {
        withCredentials: true, // ✅ this enables cookie storage
      }
    );
    console.log('Admin login response:', res.data); 
    // document.cookie = `Admin_token=${res.data.token}; path=/`;
    return res.data;
  } catch (error) {
    console.error('Error in login:', error);
    throw error;
  }
};

export const doctorLogin = async (values) => {
  try {
    const res = await axiosInstance.post('/doctor/login', values, {
      withCredentials: true,
    });
    console.log('Doctor login response:',res.data)
    const token = res.data.token;
    //document.cookie = `Doctor_token=${token}; path=/; secure; samesite=strict`;
    return res.data;
  
  } catch (error) {
    console.error('Error in doctor login:', error);
    throw error;
  }
};

export const staffLogin = async (values) => {
  try {
    const res = await axiosInstance.post('/staff/login', values, {
      withCredentials: true,
    });
    console.log(res.data)
    return res.data;
  } catch (error) {
    console.error('Error in staff login:', error);
    throw error;
  }
};

//logout services

export const adminLogout=async ()=>{
    try {
      const res= await axiosInstance.get('/admin/logout');
     // return res.data;
    } catch (error) {
      console.error('Error in Admin login:', error);
      throw error;
    }
  }

export const doctorLogout=async ()=>{
  try {
    const res= await axiosInstance.get('/doctor/logout');
   // return res.data;
  } catch (error) {
    console.error('Error in Doctor login:', error);
    throw error;
  }
}


export const staffLogout=async ()=>{
  try {
    const res= await axiosInstance.get('/staff/logout');
   // return res.data;
  } catch (error) {
    console.error('Error in staff login:', error);
    throw error;
  }
}

export const listDoctors = async () => {
  try {
    const res = await axiosInstance.get('/doctor/listdoctors');
    console.log('Doctors :', res.data); 
    return res.data.doctors; 
  } catch (error) {
    console.error('Error in listDoctors:', error);
    throw error;
  }
};