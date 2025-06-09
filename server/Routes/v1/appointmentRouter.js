const express = require('express');
const router = express.Router();
const { createAppointment, getAllAppointments,getAppointmentById,updateAppointment,deleteAppointment } = require('../../Controllers/appointmentController');
const authAnyUser = require('../../Middlewares/authAnyUser');

// Allow admin, doctor, and staff to   view and edit appointments
router.post('/', authAnyUser, createAppointment);
router.get('/:id',authAnyUser, getAppointmentById);
router.get('/', authAnyUser, getAllAppointments);
router.put('/', authAnyUser, updateAppointment);
router.delete('/', authAnyUser, deleteAppointment);

module.exports = router;