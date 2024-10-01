import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false); 
  }, []);

  const login = (token) => {
    Cookies.set('token', token, { expires: 1 });
    setIsAuthenticated(true);
    console.log('Logging in, setting token in cookies.');
    navigate('/home');
  };

  const logout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
    console.log('Logging out, token removed from cookies.');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
