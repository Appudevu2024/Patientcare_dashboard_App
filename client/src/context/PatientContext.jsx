// context/PatientContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the context
const PatientContext = createContext();

// Custom hook to use the PatientContext
export const usePatientContext = () => {
  return useContext(PatientContext);
};

// Provider component
export const PatientProvider = ({ children }) => {
  const [vitalsAddedPatients, setVitalsAddedPatients] = useState([]);

  const handleVitalsAdded = (patientId) => {
    setVitalsAddedPatients((prev) => [...prev, patientId]);
  };

  return (
    <PatientContext.Provider value={{ vitalsAddedPatients, handleVitalsAdded }}>
      {children}
    </PatientContext.Provider>
  );
};
