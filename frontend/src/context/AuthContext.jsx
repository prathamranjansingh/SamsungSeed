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
      console.log('Token found in cookies, setting authenticated state to true.');
    } else {
      setIsAuthenticated(false);
      console.log('No token found, setting authenticated state to false.');
    }
    setLoading(false); // Done checking, set loading to false
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

  if (loading) {
    // Optionally, you could display a loading spinner or nothing while loading
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
