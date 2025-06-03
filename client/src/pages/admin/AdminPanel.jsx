import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import React, { useState, useContext, useEffect } from 'react';
import Doctors from './Doctors';
import { ThemeContext } from '../../context/ThemeContext';
import BloodBankData from '../shared/BloodBankData';
import Departments from './Departments';
import Appointments from '../shared/Appointments';
import Patients from '../shared/Patients';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogout } from '../../services/loginServices';
import { clearAdmin } from '../../redux/features/adminSlice';
import { persistor } from '../../redux/store';
import StatsCards from '../../components/AdminDashboard/StatsCards';
import { LayoutDashboard, UserCheck, UserPlus, Users, CalendarCheck, Building, Droplet, LogOut, Menu } from 'lucide-react';
import StaffLists from './StaffsList';
import CreateAppointment from '../shared/CreateAppointment';

export default function AdminPanel() {
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(() => {
    const query = new URLSearchParams(location.search);
    return query.get('tab') || location.state?.defaultTab || 'dashboard';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const [showCreateAppointment, setShowCreateAppointment] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState(null);
  const navigate = useNavigate();
  const adminData = useSelector((state) => state.admin?.admin);
  const doctorData = useSelector((state) => state.doctor?.doctor);
  const staffData = useSelector((state) => state.staff?.staff);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tab = query.get('tab');

    // Case 1: Use URL if available
    if (tab) {
      setActiveTab(tab);
      setInitialized(true);
    }

    // Case 2: if defaultTab from state exists but not in URL
    else if (!initialized && location.state?.defaultTab) {
      setActiveTab(location.state.defaultTab);
      navigate(`?tab=${location.state.defaultTab}`, { replace: true });
      setInitialized(true);
    }

    // Case 3: Nothing else — back to dashboard
    else if (!initialized) {
      setActiveTab('dashboard');
      navigate(`?tab=dashboard`, { replace: true });
      setInitialized(true);
    }
  }, [location.search, location.state, initialized]);

  let loggedInUser = null;
  if (adminData?.adminExist?._id) {
    loggedInUser = { name: 'Admin', role: 'Admin' };
  } else if (doctorData?.doctorExist?._id) {
    loggedInUser = { name: doctorData.doctorExist.name, role: 'Doctor' };
  } else if (staffData?.staffExist?._id) {
    loggedInUser = { name: staffData.staffExist.name, role: 'Staff' };
  }

  const handleLogout = async () => {
    try {
      if (adminData?.email) {
        await adminLogout();
        dispatch(clearAdmin());
      }
      await persistor.purge();
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    navigate(`?tab=${tabName}`);
    setSidebarOpen(false);
    if (tabName === 'logout') {
      handleLogout();
    }
  };

  const tabs = [
    { name: 'Dashboard', value: 'dashboard', icon: LayoutDashboard },
    { name: 'Doctors', value: 'doctors', icon: UserCheck },
    { name: 'Staffs', value: 'staffs', icon: UserPlus },
    { name: 'Appointments', value: 'appointments', icon: CalendarCheck },
    { name: 'Patients', value: 'patients', icon: Users },
    { name: 'Departments', value: 'departments', icon: Building },
    { name: 'Bloodbank', value: 'bloodbank', icon: Droplet },
    { name: 'Logout', value: 'logout', icon: LogOut },
  ];

  return (
    // <div className={`flex flex-col md:flex-row min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
    <div className={`flex flex-col md:flex-row min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu />
        </button>
      </div>

      {/* Sidebar */}
      {/* <aside className={`md:w-64 w-full md:block ${sidebarOpen ? 'block' : 'hidden'} md:relative absolute z-20 bg-white dark:bg-gray-800 p-4 shadow-md`}> */}
      <aside
        className={`md:w-64 w-full md:block ${sidebarOpen ? 'block' : 'hidden'} md:relative absolute z-20 bg-white dark:bg-gray-800 p-4 shadow-md h-full md:h-auto overflow-y-auto`}
      >
        <ul className="space-y-2">
          {tabs.map(({ name, value, icon: Icon }) => (
            <li key={value}>
              <button
                onClick={() => handleTabChange(value)}
                className={`btn btn-block w-full justify-start gap-2 ${activeTab === value ? 'bg-[#0967C2] text-white' : 'btn-ghost'
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
      {/* <main className="flex-1 p-4"> */}
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <>
            <StatsCards />
            <h2 className="text-xl sm:text-2xl font-semibold mt-6 sm:mt-8 border-b pb-2 dark:text-white">
              Appointments
            </h2>
            <Appointments isDashboard={true} />
          </>
        )}
        {activeTab === 'doctors' && <Doctors />}
        {activeTab === 'staffs' && <StaffLists />}
        {/* {activeTab === 'appointments' && <Appointments />} */}
        {activeTab === 'appointments' && !showCreateAppointment && (
          <Appointments
            onAddNew={() => {
              setAppointmentToEdit(null);
              setShowCreateAppointment(true);
            }}
            onEdit={(appointment) => {
              setAppointmentToEdit(appointment);
              setShowCreateAppointment(true);
            }}
          />
        )}

        {activeTab === 'appointments' && showCreateAppointment && (
          <CreateAppointment
            appointment={appointmentToEdit}
            onClose={() => {
              setAppointmentToEdit(null);
              setShowCreateAppointment(false);
            }}
          />
        )}
        {activeTab === 'patients' && <Patients />}
        {activeTab === 'departments' && <Departments />}
        {activeTab === 'bloodbank' && <BloodBankData />}
      </main>
    </div>
  );
}

