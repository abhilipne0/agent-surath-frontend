import React from 'react';
import { Navigate } from 'react-router-dom';

const GuestRoute = ({ children }) => {
  const token = localStorage.getItem('userAuthToken');

  if (token) {
    return <Navigate to="/" />;
  }

  return children;
};

export default GuestRoute;
