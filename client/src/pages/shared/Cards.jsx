 import React from 'react'
 
 export default  function Cards({doctor}) {
   return (
    <div className="card card-side bg-base-100 shadow-xl grid grid-cols-1">
    <figure className="w-35 h-50">
      <img
        src={doctor.image}
        alt="Doctor iamge"  className='object-cover w-full h-full'/>
    </figure>
    <div className="card-body">
      <h2 className="card-title">{doctor.name}</h2>
      <p>{doctor.department}</p>
      <div className="card-actions">
        <button className="btn btn bg-[#0967C2] text-white ">View</button>
      </div>
    </div>
  </div>
   )
 }
 
 