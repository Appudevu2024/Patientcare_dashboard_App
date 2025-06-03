 import React from 'react'
import { listDoctors } from '../../services/loginServices';
 
 function DoctorList() {
  const [doctors, setDoctors] = useState([])
  useEffect(() => {
    listDoctors().then((res) => {
      console.log(res);
      setDoctors(res || []);
    })
    .catch((err) => {
      console.log('Error fetching doctors:', err);
      setDoctors([]);
    });
}, []);
 
    return (
      <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
         {doctors.map((doctor, index) => (
          <Cards key={index} doctor={doctor} />
        ))}
  
  
      </div>
   )
 }
 
 export default DoctorList
 