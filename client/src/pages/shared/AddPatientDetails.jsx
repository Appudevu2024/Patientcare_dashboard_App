import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPatientById, updatePatientVitals } from '../../services/staffServices';
import { toast } from 'react-toastify';
import { usePatientContext } from '../../context/PatientContext';
import { X } from 'lucide-react';
export default function AddPatientDetails({ id: propId, onClose }) {
    const { id: routeId } = useParams();
    const id = propId || routeId;
    const [patient, setPatient] = useState(null);
    const navigate = useNavigate();
    const [vitals, setVitals] = useState({
        height: '',
        weight: '',
        bloodPressure: '',
        temperature: '',
        pulseRate: '',
        respirationRate: '',
        diagnostic: '',
    });

    const { handleVitalsAdded } = usePatientContext();

    useEffect(() => {
        getPatientById(id)
            .then((response) => {
                if (response && response.data) {
                    const patientData = response.data.appointment;
                    const doctorData = response.data.doctor;
                    setPatient({
                        name: patientData.patientname || '',
                        contact: patientData.contact || '',
                        dateOfBirth: patientData.dateOfBirth || '',
                        date: patientData.createdAt || '',
                        time: patientData.time || '',
                        doctor: patientData.doctor?._id || '',
                        doctorname: doctorData.name || '',
                    });
                    setVitals(patientData.vitals || {
                        height: '',
                        weight: '',
                        bloodPressure: '',
                        temperature: '',
                        pulseRate: '',
                        respirationRate: '',
                        diagnostic: '',
                    });
                } else {
                    toast.error('Patient not found');
                }
            })
            .catch(() => {
                toast.error('Error fetching patient details');
            });
    }, [id]);

    const handleChange = (e) => {
        setVitals({ ...vitals, [e.target.name]: e.target.value });
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const requiredFields = [
    //         'height', 'weight', 'bloodPressure', 'temperature', 'pulseRate', 'respirationRate'
    //     ];
    //     for (const field of requiredFields) {
    //         if (!vitals[field]) {
    //             toast.error('All vital fields are required');
    //             return;
    //         }
    //     }
    //     try {
    //         await updatePatientVitals(id, vitals);
    //         handleVitalsAdded(id);
    //         toast.success('Patient vitals updated', { position: 'top-center' });
    //         navigate('/staffpanel?tab=patients');
    //     } catch {
    //         toast.error('Error updating patient vitals');
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Required fields check (already implemented)
        const requiredFields = [
            'height', 'weight', 'bloodPressure', 'temperature', 'pulseRate', 'respirationRate'
        ];
        for (const field of requiredFields) {
            if (!vitals[field]) {
                toast.error('All vital fields are required');
                return;
            }
        }

        // Height validation
        const heightNum = Number(vitals.height);
        if (isNaN(heightNum) || heightNum < 30 || heightNum > 300) {
            toast.error('Height must be a number between 30 and 300 cm');
            return;
        }

        // Weight validation
        const weightNum = Number(vitals.weight);
        if (isNaN(weightNum) || weightNum < 1 || weightNum > 500) {
            toast.error('Weight must be a number between 1 and 500 kg');
            return;
        }

        // Blood Pressure validation: format "systolic/diastolic"
        const bpParts = vitals.bloodPressure.split('/');
        if (
            bpParts.length !== 2 ||
            isNaN(Number(bpParts[0])) ||
            isNaN(Number(bpParts[1])) ||
            Number(bpParts[0]) < 50 || Number(bpParts[0]) > 250 ||
            Number(bpParts[1]) < 30 || Number(bpParts[1]) > 150
        ) {
            toast.error('Blood Pressure must be in format "systolic/diastolic" with reasonable values');
            return;
        }

        // Temperature validation
        const tempNum = Number(vitals.temperature);
        if (isNaN(tempNum) || tempNum < 95 || tempNum > 107.6) {
            toast.error('Temperature must be a number between 95 and 107.6 °F');
            return;
        }

        // Pulse Rate validation
        const pulseNum = Number(vitals.pulseRate);
        if (isNaN(pulseNum) || pulseNum < 40 || pulseNum > 200) {
            toast.error('Pulse Rate must be a number between 40 and 200 bpm');
            return;
        }

        // Respiration Rate validation
        const respNum = Number(vitals.respirationRate);
        if (isNaN(respNum) || respNum < 10 || respNum > 40) {
            toast.error('Respiration Rate must be a number between 10 and 40 breaths per minute');
            return;
        }
// Diagnostic 
        if (!vitals.diagnostic || vitals.diagnostic.trim() === '') {
            toast.error('Diagnostic field cannot be empty');
            return;
        }
        //  check max length (e.g., max 500 characters)
        if (vitals.diagnostic && vitals.diagnostic.length > 500) {
            toast.error('Diagnostic text is too long (max 500 characters)');
            return;
        }

        // Proceed with API call if all validations pass
        try {
            await updatePatientVitals(id, vitals);
            handleVitalsAdded(id);
            toast.success('Patient vitals updated', { position: 'top-center' });
            navigate('/staffpanel?tab=patients');
        } catch {
            toast.error('Error updating patient vitals');
        }
    };


    if (!patient) {
        return (
            <div className="flex justify-center items-center h-screen dark:bg-base-200">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const formatTime = (time) => {
        if (!time) return 'N/A';
        const [hourStr, minute] = time.split(":");
        let hour = parseInt(hourStr, 10);
        const suffix = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${suffix}`;
    };

    return (
        <div className="flex items-center justify-center bg-base-200 py-8 px-4 dark:bg-gray-900">
            <div className="w-full max-w-4xl">

                <div className="card bg-white dark:bg-gray-800 shadow-md p-6 mb-6 rounded-lg border border-gray-300 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-[#075bb0] ">Patient Details</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-600"
                            title="Close"
                        >
                            <X size={20} className="text-red-600 dark:text-white" />
                        </button>
                    </div>
                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                        <p><strong>Name:</strong> {patient.name}</p>
                        <p><strong>Contact:</strong> {patient.contact}</p>
                        <p><strong>Date of Birth:</strong> {formatDate(patient.dateOfBirth)}</p>
                        <p><strong>Doctor:</strong> {patient.doctorname}</p>
                        <p><strong>Visited:</strong> {formatDate(patient.date)} {formatTime(patient.time)}</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input name="height" value={vitals.height} onChange={handleChange} placeholder="Height in cm"
                        className="input input-bordered w-full text-black dark:text-white bg-white dark:bg-gray-800" />
                    <input name="weight" value={vitals.weight} onChange={handleChange} placeholder="Weight in kg"
                        className="input input-bordered w-full text-black dark:text-white bg-white dark:bg-gray-800" />
                    <input name="bloodPressure" value={vitals.bloodPressure} onChange={handleChange} placeholder="Blood Pressure eg:80/120"
                        className="input input-bordered w-full text-black dark:text-white bg-white dark:bg-gray-800" />
                    <input name="temperature" value={vitals.temperature} onChange={handleChange} placeholder="Body Temperature"
                        className="input input-bordered w-full text-black dark:text-white bg-white dark:bg-gray-800" />
                    <input name="pulseRate" value={vitals.pulseRate} onChange={handleChange} placeholder="Pulse Rate"
                        className="input input-bordered w-full text-black dark:text-white bg-white dark:bg-gray-800" />
                    <input name="respirationRate" value={vitals.respirationRate} onChange={handleChange} placeholder="Respiration Rate"
                        className="input input-bordered w-full text-black dark:text-white bg-white dark:bg-gray-800" />
                    <textarea name="diagnostic" value={vitals.diagnostic} onChange={handleChange} placeholder="Diagnostic"
                        className="textarea textarea-bordered sm:col-span-2 w-full text-black dark:text-white bg-white dark:bg-gray-800" />
                    <div className="sm:col-span-2 flex justify-center mt-4">
                        <button type="submit"
                            className="btn bg-[#0967C2] text-white hover:bg-[#075bb0] dark:bg-blue-600 dark:hover:bg-blue-500 min-w-[200px]">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
