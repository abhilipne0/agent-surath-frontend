import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthenticatedRoute = ({ children }) => {
  const token = localStorage.getItem('userAuthToken');

  if (!token) {
    return <Navigate to="/login" />
  }

  return children;
};

export default AuthenticatedRoute;
