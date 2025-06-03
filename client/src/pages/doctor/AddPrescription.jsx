import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addPrescription, getPatientById } from '../../services/doctorServices';
import { toast } from 'react-toastify';

export default function AddPrescription({  id: propId, onClose }) {
  const { id: routeId } = useParams();
  const id = propId||routeId;
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [prescription, setPrescription] = useState('');
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    getPatientById(id)
      .then((data) => {
        setPatient(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch patient details:', err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPrescription(id, prescription);
      toast.success('Prescription Saved successfully',{position:'top-center'});
      navigate('/doctorpanel?tab=patients');
      
      }
     catch (error) {
      console.error('Error submitting prescription:', error);
    }
  };

const handleCancel = () => {
  if (onClose) {
    onClose();
  } else {
    navigate('/doctorpanel', { state: { defaultTab: 'patients' } });
  }
};

  if (loading) return <div>Loading...</div>;
  if (!patient) return <div>Patient not found...</div>;

  return (
     <div className=" flex items-center justify-center bg-gray-50">
    <div className="p-2 align-items-center">
      <h2 className="text-2xl font-bold  text-[#0967C2] mb-4">Patient Info</h2>
      <div className="space-y-2 mb-6">
        <p className="text-lg text-[#0967C2]"><strong>Name:</strong> {patient.name}</p>
        <p className="text-lg text-[#0967C2]"><strong>Contact:</strong> {patient.contact}</p>
        <p className="text-lg text-[#0967C2]"><strong>DOB:</strong> {new Date(patient.dateOfBirth).toLocaleDateString('en-GB')}</p>
        <p className="text-lg text-[#0967C2]"><strong>Date:</strong> {patient?.appointment?.date ? new Date(patient.appointment.date).toLocaleDateString('en-GB') : 'N/A'}</p>

        <h3 className="text-lg text-[#0967C2]"><strong><u>Vital details</u></strong></h3>
        <p><strong>Height:</strong> {patient?.vitals?.height || 'N/A'}cm</p>
        <p><strong>Weight:</strong> {patient?.vitals?.weight || 'N/A'}kg</p>
        <p><strong>BP:</strong> {patient?.vitals?.bloodPressure || 'N/A'} mm Hg</p>
        <p><strong>Temp:</strong> {patient?.vitals?.temperature || 'N/A'} °F</p>
        <p><strong>Pulse:</strong> {patient?.vitals?.pulseRate || 'N/A'} bpm</p>
        <p><strong>RR:</strong> {patient?.vitals?.respirationRate || 'N/A'} b/min</p>
        <p><strong>Diag:</strong> {patient?.vitals?.diagnostic || 'N/A'}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#0967C2] underline mb-2">Previous Prescriptions</h3>
        {patient.prescriptions?.length > 0 ? (
          patient.prescriptions.map((pres, index) => (
            <p key={index} className="text-gray-700 mb-1">
              <strong>#{index + 1}:</strong> {pres.prescription}
            </p>
          ))
        ) : (
          <p className="text-[#0967C2]">No prescriptions available.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-lg font-semibold text-[#0967C2]">New Prescription</span>
          <textarea
            rows="4"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
            required
          ></textarea>
        </label>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-[#0967C2] text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Prescription
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}


