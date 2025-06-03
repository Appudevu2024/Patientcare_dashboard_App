import React from 'react'
import { Outlet } from 'react-router-dom';
//import Header from '../components/homepage/Header';
import DashboardHeader from '../components/shared/DashboardHeader';
 
function StaffLayout() {
  return (
    <div>
      <DashboardHeader/>
      <Outlet/>
    </div>
  )
}

export default StaffLayout
