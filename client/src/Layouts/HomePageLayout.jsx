 import React from 'react'
import Header from '../components/homepage/Header'
import Footer from '../components/homepage/Footer'
import { Outlet } from 'react-router-dom';
 function HomePageLayout() {
   return (
    <div>
       <Header/>
       <Outlet/>
        <Footer/> 
     </div>
   )
 }
 
 export default HomePageLayout
 