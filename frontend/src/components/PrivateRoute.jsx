// components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useAuth(); // Assuming isAuthenticated checks the token

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
