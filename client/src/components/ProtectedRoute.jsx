import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { jwtDecode } from 'jwt-decode';
const useAuth = (allowedRoles) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  const getTokenFromCookies = () => {
    const cookie = document.cookie;
    console.log('👀 document.cookie:', document.cookie);
    const roleToTokenMap = {
      admin: 'Admin_token',
      doctor: 'Doctor_token',
      staff: 'Staff_token',
    };

    for (let role of allowedRoles) {
      const tokenName = roleToTokenMap[role.toLowerCase()];
      const match = cookie.match(new RegExp(`${tokenName}=([^;]+)`));
      if (match) return { token: match[1], tokenName };
    }

    return null;
  };
  useEffect(() => {
    console.log('🍪 document.cookie:', document.cookie);
    console.log('🧠 Matched token:', getTokenFromCookies());
    const result = getTokenFromCookies();
    if (result) {
      try {
        const decoded = jwtDecode(result.token);
        console.log("🔓 Decoded Token in ProtectedRoute:", decoded);
        setRole((decoded?.role || '').toLowerCase());
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
    setLoading(false);
  }, []);

  return { isAuthenticated, role, loading };
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth(allowedRoles);
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  // 🔍 Debugging logs before redirection decision
  console.log("✅ isAuthenticated:", isAuthenticated);
  console.log("✅ role:", role);
  console.log("✅ allowedRoles:", allowedRoles);
  console.log("✅ allowedRoles includes role:", allowedRoles.map(r => r.toLowerCase()).includes(role));

  // if (!isAuthenticated || !allowedRoles.map(r => r.toLowerCase()).includes(role)) {
  //   return <Navigate to="/" replace />;
  // }
  if (!isAuthenticated || !allowedRoles.map(r => r.toLowerCase()).includes(role.toLowerCase())) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
