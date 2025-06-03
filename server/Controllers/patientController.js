
const patientDb = require('../Models/patientModel');




const getAllPatients = async (req, res) => {
    try {
      const patients = await patientDb
        .find()
        .populate('doctor')           // Populates doctor info
        .populate('appointment')      // Populates appointment info
        .sort({ createdAt: -1 });
  
      if (!patients || patients.length === 0) {
        return res.status(404).json({ message: 'No patients found' });
      }
  
      res.status(200).json({ patients });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message || 'Failed to fetch patients' });
    }
  };






const getPatientsForDoctor  = async (req, res) => {
    try {
       console.log('Authenticated doctor:', req.user);
        const doctorId = req.user.id;
      const patients = await patientDb
        .find({ doctor: doctorId })
        .populate('appointment')      // Populates appointment info
        .sort({ createdAt: -1 });
  console.log('Found patients:', patients.length);
      if (!patients || patients.length === 0) {
        return res.status(404).json({ message: 'No patients found' });
      }
  
      res.status(200).json({ patients });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message || 'Failed to fetch patients' });
    }
  };



  
  const getPatientById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const patient = await patientDb
        .findById(id)
        .populate('doctor')
        .populate('appointment');
  
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      res.status(200).json(patient);
    } catch (error) {
      console.error('Error fetching patient by ID:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch patient' });
    }
  };


  
  const updatePatientVitals = async (req, res) => {
    try {
      const { id } = req.params;
      const vitals = req.body;
  
      const updatedPatient = await patientDb.findByIdAndUpdate(
        id,
        { vitals,status:'completed' },
        { new: true }
      );
  
      if (!updatedPatient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      res.status(200).json({ message: 'Vitals updated successfully', updatedPatient });
    } catch (error) {
      console.error('Error updating patient vitals:', error);
      res.status(500).json({ message: error.message || 'Failed to update vitals' });
    }
  };




const addPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { prescription } = req.body;
    const doctorId = req.user.id; // Authenticated doctor

    const patient = await patientDb.findById(id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    // Add new prescription to the prescriptions array
    patient.prescriptions.push({
      prescription,
      doctor: doctorId,
      vitalsSnapshot: patient.vitals
    });

    // Optionally update status
    patient.status = 'Active';
    await patient.save();

    res.status(200).json({ message: 'Prescription added successfully' });
  } catch (error) {
    console.error('Error adding prescription:', error);
    res.status(500).json({ message: error.message || 'Failed to add prescription' });
  }
};


const updatePatientStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const updatedPatient = await patientDb.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ message: 'Status updated successfully', updatedPatient });
  } catch (error) {
    console.error('Error updating patient status:', error);
    res.status(500).json({ message: error.message || 'Failed to update status' });
  }
};



const deletePatient = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({ error: 'Id is required' });
        }

        const deletedPatient = await patientDb.findOneAndDelete({ _id });

        if (!deletedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        return res.status(200).json({ message: 'Patient deleted successfully', deletedPatient });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}



module.exports = {  getAllPatients, getPatientsForDoctor, deletePatient, getPatientById,
  updatePatientVitals, addPrescription ,updatePatientStatus}