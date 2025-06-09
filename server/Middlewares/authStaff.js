 const jwt= require('jsonwebtoken');
//  const createToken = require("../Utilities/generateToken");
//  const cookieParser = require('cookie-parser');
 require('dotenv').config();
 
 const authStaff= (req,res,next)=>{
 try {
     //const {token}=req.cookies;
     //console.log(req.cookies);
     const {Staff_token} = req.cookies ;
    console.log(Staff_token);
    
     if(!Staff_token){
         return res.status(401).json({error:'Jwt not found'});
     }
     
     const verifiedToken=jwt.verify(Staff_token, process.env.JWT_SECRET)
     if(!verifiedToken){
         return res.status(401).json({error:'User not authorized'});
     }
    
 
     if(verifiedToken.role!=='staff'){
         return res.status(401).json({error:'Access denied'});
     }
 
     req.user=verifiedToken.id;
     next();
 } catch (error) {
     
    return  res.status(error.status || 401).json({ error: error.message || 'User authorization failed' }) 
 }
 }
 
 module.exports=authStaff;