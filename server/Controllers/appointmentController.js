const appointmentDB= require('../Models/appointmentModel')
const patientDB = require('../Models/patientModel'); 
const mongoose = require('mongoose');

const createAppointment = async (req, res) => {
    const { patientname,dateOfBirth,contact, doctor, date, time, status } = req.body;
  
    try {
      const dateOnly = new Date(date + 'T00:00:00Z').toISOString().split('T')[0];

      // 🔍 Check if the same doctor already has an appointment at the same date & time
      const existingAppointment = await appointmentDB.findOne({
        doctor,
        date:dateOnly,
        time,
      });
  
      if (existingAppointment) {
        return res.status(400).json({
          message: 'Doctor already has an appointment at this date and time.'
        });
      }
  
      const newAppointment = await appointmentDB.create({
        patientname,
        dateOfBirth,
        contact,
        doctor,
        date:dateOnly,
        time,
        status
      });
  
      res.status(201).json({ message: 'Appointment created successfully', data: newAppointment });
    } catch (error) {
      console.log(error);
      res.status(error.status || 500).json({ error: error.message || 'Internal server error' })
}
  }
  

  const getAllAppointments = async (req, res) => {
    try {
      const { role,  id:userId} = req.user;
  console.log('User in getAllAppointments:', req.user);
      let query = {};
      if (role === 'doctor') {
        query = { doctor: userId}; 
      }
  console.log('📦 Mongo Query:', query);
      const appointments = await appointmentDB.find(query).populate('doctor', 'name');
      res.status(200).json(appointments);
    } catch (error) {
      console.log(error);
      res.status(error.status || 500).json({ error: error.message || 'Internal server error' })
}
  };

const getDoctorAppointments  = async (req, res) => {
    try {
       console.log('Authenticated doctor:', req.user);
        const doctorId = req.user.id;
      const appointments = await appointmentDB
        .find({ doctor: doctorId })
        .sort({ createdAt: -1 });
  console.log('Found appointments:', appointments.length);
      if (!appointments || appointments.length === 0) {
        return res.status(404).json({ message: 'No appointments found' });
      }
  
      res.status(200).json({ appointments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message || 'Failed to fetch appointments' });
    }
  };




  

const getAppointmentById = async (req, res) => {
  const appointment = await appointmentDB.findById(req.params.id).populate('doctor');
  if (!appointment) return res.status(404).json({ message: "Appointment not found" });
  res.json(appointment);
};


  
//   const updateAppointment = async (req, res) => {
//   const { _id, patientname,dateOfBirth, contact, doctor, date, time, status } = req.body;
  
//   try {
//     const dateOnly = new Date(date + 'T00:00:00Z').toISOString().split('T')[0];
  
  
//   //  Check if another appointment already exists for the doctor at that date and time
//   const existingAppointment = await appointmentDB.findOne({
//     doctor,
//     date: dateOnly,
//     time,
//     _id: { $ne: _id } 
//   });
  
//   if (existingAppointment) {
//     return res.status(400).json({ message: 'Doctor already has an appointment at this time' });
//   }
  
//   // Proceed to update
//   const updatedAppointment = await appointmentDB.findOneAndUpdate(
//     { _id },
//     { patientname, dateOfBirth,contact, doctor, date: dateOnly, time, status },
//     { new: true, runValidators: true }
//   );
  
//   if (!updatedAppointment) {
//     return res.status(404).json({ message: 'Appointment not found' });
//   }
  
//   return res.status(200).json({ message: 'Appointment updated successfully', appointment: updatedAppointment });

  
//   } catch (error) {
//   res.status(400).json({ message: error.message });
//   }
//   };
  

  


const deleteAppointment = async (req, res) => {
    const { _id } = req.body;
  
    try {
      const deletedAppointment = await appointmentDB.findOneAndDelete({ _id });
  
      if (!deletedAppointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
  
      return res.status(200).json({ message: "Appointment deleted successfully", deletedAppointment});
    } catch (error) {
      console.log(error);
      res.status(error.status || 500).json({ error: error.message || 'Internal server error' })
}
  }
  

const updateAppointment = async (req, res) => {
  const { _id, patientname, dateOfBirth, contact, doctor, date, time, status } = req.body;

  try {
    const dateOnly = new Date(date + 'T00:00:00Z').toISOString().split('T')[0];

    const existingAppointment = await appointmentDB.findOne({
      doctor,
      date: dateOnly,
      time,
      _id: { $ne: _id },
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Doctor already has an appointment at this time' });
    }

    const updatedAppointment = await appointmentDB.findOneAndUpdate(
      { _id },
      { patientname, dateOfBirth, contact, doctor, date: dateOnly, time, status },
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    //  Create patient if status is 'confirmed' and not already added
    if (status === 'Confirmed') {
      const existingPatient = await patientDB.findOne({ appointment: _id });

      if (!existingPatient) {
        await patientDB.create({
          name: patientname,
          dateOfBirth,
          contact,
          doctor,
          appointment: _id
        });
      }
    }

    return res.status(200).json({
      message: 'Appointment updated successfully',
      appointment: updatedAppointment
    });
  }
    catch (error) {
      console.log(error);
      res.status(error.status || 500).json({ error: error.message || 'Internal server error' })
}
};


module.exports={
      createAppointment,
      getAllAppointments,
      getDoctorAppointments,
      getAppointmentById,
      updateAppointment,
      deleteAppointment
  }







