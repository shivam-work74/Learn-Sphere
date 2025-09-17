// src/components/routing/InstructorRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const InstructorRoute = () => {
  const { user } = useAuth();

  // If user exists and their role is 'instructor', show the nested page.
  // Otherwise, redirect them to the login page.
  return user && user.role === 'instructor' ? <Outlet /> : <Navigate to="/login" />;
};

export default InstructorRoute;