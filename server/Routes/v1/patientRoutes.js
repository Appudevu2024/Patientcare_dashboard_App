const express = require('express');
const router = express.Router();
const {  getAllPatients, getPatientsForDoctor, getPatientById , deletePatient,updatePatientVitals, addPrescription,updatePatientStatus  } = require('../../Controllers/patientController');
const authStaff = require('../../Middlewares/authStaff');
const authDoctor= require('../../Middlewares/authDoctor');
const authAdmin= require('../../Middlewares/authAdmin')
const authAnyUser= require('../../Middlewares/authAnyUser')


router.get('/by-doctor', authDoctor, getPatientsForDoctor);
router.get('/', authAdmin, getAllPatients);
router.get('/by-staff', authStaff, getAllPatients);
// router.get('/test', (req, res) => {
//   res.send('Doctor Patient route working');
// });
router.post('/prescriptions/:id', authDoctor, addPrescription);
router.put('/:id/status',authDoctor, updatePatientStatus);
router.put('/:id/vitals', authAnyUser, updatePatientVitals );
router.get('/:id', authAnyUser, getPatientById);




router.delete('/', authAnyUser, deletePatient);


module.exports = router;