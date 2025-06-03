import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeContext } from '../../context/ThemeContext';
import BloodBankData from '../shared/BloodBankData';
import { adminLogout } from '../../services/loginServices';
import { clearAdmin } from '../../redux/features/adminSlice';
import { persistor } from '../../redux/store';
import {
  LayoutDashboard,
  Users,
  Droplet,
  LogOut,
  Menu,
} from 'lucide-react';
import DoctorCards from '../../components/DoctorDashboard/DoctorCards';
import DoctorAppointment from './DoctorAppointment';
import DoctorPatients from './DoctorPatients';
import AddPrescription from './AddPrescription';

export default function DoctorPanel() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState(null);

  const handleEditPrescription = (patientId) => {
      console.log('Editing prescription for patient ID:', patientId);
    setEditingPatientId(patientId);
  };

  const handleClosePrescription = () => {
    setEditingPatientId(null);
  };


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const adminData = useSelector((state) => state.admin?.admin);

  useEffect(() => {
    if (location.state?.defaultTab) {
      setActiveTab(location.state.defaultTab);
      navigate(`?tab=${location.state.defaultTab}`, { replace: true });
    }
  }, [location.state, navigate]);

  const handleLogout = async () => {
    try {
      if (adminData?.email) {
        await adminLogout();
        dispatch(clearAdmin());
      }
      await persistor.purge();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // const handleTabChange = (tabName) => {
  //   setActiveTab(tabName);
  //   navigate(`?tab=${tabName}`);
  //   if (tabName === 'logout') handleLogout();
  //   if (tabName !== 'bloodbank') setIsModalOpen(false);

  //   // Close sidebar on mobile
  //   if (window.innerWidth < 768) {
  //     setSidebarOpen(false);
  //   }
  // };
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    navigate(`?tab=${tabName}`);

    if (tabName === 'logout') {
      handleLogout();
    } else if (tabName === 'bloodbank') {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }

    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={`flex flex-col md:flex-row min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>

      {/* Mobile Top Bar */}
      <div className="flex justify-between items-center md:hidden p-4 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-lg font-semibold">Doctor Panel</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`w-full md:w-64 md:block ${sidebarOpen ? 'block' : 'hidden'} md:relative absolute z-30 bg-white dark:bg-gray-800 p-4 shadow-lg md:shadow-md transition-all duration-300`}>
        <ul className="space-y-2">
          {[
            { name: 'Dashboard', icon: LayoutDashboard, key: 'dashboard' },
            { name: 'Appointments', icon: LayoutDashboard, key: 'appointments' },
            { name: 'Patients', icon: Users, key: 'patients' },
            { name: 'Bloodbank', icon: Droplet, key: 'bloodbank' },
            { name: 'Logout', icon: LogOut, key: 'logout' },
          ].map(({ name, icon: Icon, key }) => (
            <li key={key}>
              <button
                onClick={() => handleTabChange(key)}
                className={`btn btn-block w-full justify-start gap-2 text-left transition ${activeTab === key ? 'bg-[#0967C2] text-white' : 'btn-ghost dark:text-white'
                  }`}
              >
                <Icon className="w-5 h-5" />
                {name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto dark:bg-gray-900">
        {activeTab === 'dashboard' && (
          <>
            <DoctorCards />
            <DoctorAppointment />
          </>
        )}
        {activeTab === 'appointments' && <DoctorAppointment />}
        {activeTab === 'patients' && <DoctorPatients />}
      

            {activeTab === 'bloodbank' && isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg max-w-5xl max-h-[90vh] overflow-y-auto p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Blood Bank Information</h3>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        setActiveTab('dashboard');
                        navigate('?tab=dashboard');
                      }}
                      className="btn btn-sm btn-circle btn-ghost dark:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="modal-bloodbank-slim">
                    <BloodBankData />
                  </div>
                </div>
              </div>
            )}
          </div>
      </div>
      );
}
