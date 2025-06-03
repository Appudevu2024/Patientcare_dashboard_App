function  timeConversion (timeStr){
    const [time, modifier] = timeStr.trim().toUpperCase().split(/(AM|PM)/);
    if (!time || !modifier) return '';
  
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
  
    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
  
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }
  
  export default timeConversion