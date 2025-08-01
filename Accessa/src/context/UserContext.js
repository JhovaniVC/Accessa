import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const logout = () => {
    setUser(null);
  };

  // Función para determinar el rol del usuario
  const getUserRole = () => {
    if (!user) return null;
    return user.role || 'resident'; // Por defecto es residente
  };

  // Función para verificar si es guardia
  const isGuard = () => {
    return getUserRole() === 'guard';
  };

  // Función para verificar si es residente
  const isResident = () => {
    return getUserRole() === 'resident';
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      logout, 
      getUserRole, 
      isGuard, 
      isResident 
    }}>
      {children}
    </UserContext.Provider>
  );
} 