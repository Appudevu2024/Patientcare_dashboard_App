
const mongoose = require('mongoose');

const vitalsSchema = new mongoose.Schema({
  height:String,
  weight:String,
  bloodPressure: String,
  temperature: String,
  pulseRate: String,
  respirationRate: String,
  diagnostic: String
}, { _id: false }); // Prevents creating separate _id for each vitals object

const prescriptionSchema = new mongoose.Schema({
  prescription: { type: String, required: true },
  date: { type: Date, default: Date.now },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  vitalsSnapshot: vitalsSchema
}, { _id: false }); // Embedded, not a separate model

const patientSchema = new mongoose.Schema({
  name: String,
  dateOfBirth: Date,
  contact: String,
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  registeredAt: { type: Date, default: Date.now },
  vitals: vitalsSchema ,// Add vitals field
  status: String,//after vitals update the status as completed
  prescriptions: [prescriptionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);