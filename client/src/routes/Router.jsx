import { createBrowserRouter } from "react-router-dom";
import HomePageLayout from "../Layouts/HomePageLayout";
import HomePage from "../pages/shared/HomePage";
import LoginPage from "../pages/shared/LoginPage";
import AdminPanel from "../pages/admin/AdminPanel";
import ProtectedRoute from "../components/ProtectedRoute";
import Adminlayout from "../Layouts/Adminlayout";
import DoctorLayout from "../Layouts/DoctorLayout";
import DoctorPanel from "../pages/doctor/DoctorPanel";
import StaffLayout from "../Layouts/StaffLayout";
import StaffPanel from "../pages/servicestaff/StaffPanel";
import Doctors from "../pages/admin/Doctors";
import DoctorRegistration from "../pages/admin/DoctorRegistration";
import DoctorDetails from "../pages/doctor/DoctorDetails";

import BloodBankData from "../pages/shared/BloodBankData";
import Departments from "../pages/admin/Departments";
import CreateAppointment from "../pages/shared/CreateAppointment";
import Appointments from "../pages/shared/Appointments";
import Patients from "../pages/shared/Patients";
import StaffLists from "../pages/admin/StaffsList";
import AddPatientDetails from "../pages/shared/AddPatientDetails";
import AddPrescription from "../pages/doctor/AddPrescription";
import DoctorPatients from "../pages/doctor/DoctorPatients";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePageLayout />,
    errorElement: <h1>Error Page</h1>,
    children: [
      {
        path: '',
        element: <HomePage />,
      },

      {
        path: 'login',
        element: <LoginPage />,
      },


    ]
  },
  {
    path: '/adminpanel',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <Adminlayout />
      </ProtectedRoute>
    ),
    errorElement: <h1>Error Page</h1>,
    children: [
      {
        path: '', // default child route of /adminpanel
        element: <AdminPanel />,
      },
      {
        path: 'doctors', //  /adminpanel/doctors
        element: <Doctors />,
      },
      {
        path: 'register', // /adminpanel/doctor/add new
        element: <DoctorRegistration />,
      },
      {
        path: 'doctors/doctorDetails/:id', //  /adminpanel/doctors/doctordetails
        element: <DoctorDetails />,
      },
      {
        path: 'doctorUpdation/:id', // /adminpanel/doctors/doctorupdation
        element: <DoctorRegistration />,
      },
      {
        path: 'bloodbank', //  /adminpanel/bloodbank
        element: <BloodBankData />,
      },
      {
        path: 'departments', //  /adminpanel/departments
        element: <Departments />,
      },
      {
        path: 'appointments', //  /adminpanel/appointments
        element: <Appointments />,
      },
      {
        path: 'create-appointment',
        element: <CreateAppointment />,
      },
      {
        path: 'create-appointment/:id?',
        element: <CreateAppointment />,
      },
      {
        path: 'patients', //  /adminpanel/patients
        element: <Patients />,
      },
      {
        path: 'staffs', //  /adminpanel/staffs
        element: <StaffLists />,
      },
    ],

  },
  {
    path: '/doctorpanel',
    element: (
      <ProtectedRoute allowedRoles={['doctor']}>
        <DoctorLayout />
      </ProtectedRoute>
    ),
    errorElement: <h1>Error Page</h1>,
    children: [
      {
        path: '', // default child route of /doctorpanel
        element: <DoctorPanel />,
      },
      {
        path: 'patients',
        element: <DoctorPatients />,
      },
      {
        path: 'add-prescription/:id',
        element: <AddPrescription />

      },
    ],
  },
  {
    path: '/staffpanel',
    element: (
      <ProtectedRoute allowedRoles={['staff']}>
        <StaffLayout />
      </ProtectedRoute>
    ),
    errorElement: <h1>Error Page</h1>,
    children: [
      {
        path: '', // default child route of /staffpanel
        element: <StaffPanel />,
      },
      {
        path: 'patientdetails/:id',
        element: <AddPatientDetails />,
      },

    ],
  }


]);