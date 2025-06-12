// middlewares/authAnyUser.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authAnyUser = (req, res, next) => {
  const { Admin_token, Doctor_token, Staff_token } = req.cookies;

  let token = Admin_token || Doctor_token || Staff_token;
  if (!token) {
    return res.status(401).json({ error: 'JWT token not found' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach info to req based on role
    req.user = {
      id:  decoded._id ||decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authAnyUser;
