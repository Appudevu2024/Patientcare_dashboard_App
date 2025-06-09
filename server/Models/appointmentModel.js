const mongoose=require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientname:{
        type:String,
        required:true,
        
    },
    dateOfBirth: {
        type: Date,
        required: true,
        
    },

    contact:{
        type:Number,
        required:true,
    },
    doctor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor', // Reference to doctor model
        required: true
    },
    date: {
        type: Date,
        required: true,
        
    },
    time: {
        type: String,
        required: true,
         
    },
    status: {
        type: String,
        required: true
    }

},{timestamps:true})


module.exports= new mongoose.model('Appointment',appointmentSchema)