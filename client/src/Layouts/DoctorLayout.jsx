 import React from 'react'
//import Header from '../components/homepage/Header'
import { Outlet } from 'react-router-dom';
import DashboardHeader from '../components/shared/DashboardHeader';
 
 function DoctorLayout() {
   return (
     <div>
        <DashboardHeader/>
        <Outlet/>
     </div>
   )
 }
 
 export default DoctorLayout
 