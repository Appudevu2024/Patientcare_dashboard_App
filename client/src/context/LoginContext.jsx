import React, { createContext, useState } from 'react';

export const LoginContext = createContext();

export function LoginProvider({ children }) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <LoginContext.Provider value={{ showLogin, setShowLogin }}>
      {children}
    </LoginContext.Provider>
  );
}
