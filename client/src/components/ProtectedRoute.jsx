import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'

const useAuth = (allowedRoles) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const tokens = ['Admin_token', 'doctor_token', 'staff_token'];
    const tokenString = tokens
    .map(name => document.cookie.split('; ').find(cookie => cookie.startsWith(name)))
    .find(Boolean); 
    console.log(tokenString);
    
        if (tokenString) {
          const token = tokenString.split('=')[1];
          try {
            const decoded = jwtDecode(token);
            console.log(decoded.role);
            
            setRole(decoded.role);
            setIsAuthenticated(true);
          } catch (err) {
            console.error('Invalid token', err);
          }
        }
      
    setLoading(false);
  }, []);

  return { isAuthenticated, role,loading };
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();
   if (loading)  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="spinner" />
    </div>
  );

  if (!isAuthenticated|| !allowedRoles.includes(role)) {
    // Redirect to login if not authenticated
    return <Navigate to="/" replace />;
  }

  

  return children; 
};

export default ProtectedRoute;
