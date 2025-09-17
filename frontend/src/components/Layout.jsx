// src/components/Layout.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideOnRoutes = ['/learn']; // Add any other routes where you want to hide them

  // Check if the current path starts with any of the paths in hideOnRoutes
  const shouldHide = hideOnRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      {!shouldHide && <Navbar />}
      <main>{children}</main>
      {!shouldHide && <Footer />}
    </>
  );
};

export default Layout;