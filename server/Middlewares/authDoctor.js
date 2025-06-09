 const jwt= require('jsonwebtoken');
//  const createToken = require("../Utilities/generateToken");
//  const cookieParser = require('cookie-parser');
 require('dotenv').config();
 
 const authDoctor= (req,res,next)=>{
 try {
     //const {token}=req.cookies;
     //console.log(req.cookies);
     const {Doctor_token} = req.cookies ;
    
     if(!Doctor_token){
         return res.status(401).json({error:'Unauthorized'});
     }
     
     const verifiedToken=jwt.verify(Doctor_token, process.env.JWT_SECRET)
     if(!verifiedToken){
         return res.status(401).json({error:'Doctor not authorized'});
     }
    
 
     if(verifiedToken.role!=='doctor'){
         return res.status(401).json({error:'Access denied'});
     }
 
     req.user=verifiedToken;
     next();
 } catch (error) {
     
    return  res.status(error.status || 401).json({ error: error.message || 'User authorization failed' }) 
 }
 }
 
 module.exports=authDoctor;