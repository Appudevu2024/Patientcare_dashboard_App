 import React from 'react'
//import Header from '../components/homepage/Header'
import { Outlet } from 'react-router-dom';
import DashboardHeader from '../components/shared/DashboardHeader';
 
 function Adminlayout() {
   return (
     <div>
       <DashboardHeader/>
       <Outlet/>
      
     </div>
   )
 }
 
 export default Adminlayout
 