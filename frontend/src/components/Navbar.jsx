// src/components/Navbar.js
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu } from '@headlessui/react';
import { motion } from 'framer-motion';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {children}
    </Link>
  );

  // --- MERGED: Updated dashboard path to include admin ---
  const dashboardPath = user?.role === 'admin' 
    ? '/admin/dashboard' 
    : user?.role === 'instructor' 
    ? '/instructor/dashboard' 
    : '/dashboard';

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50 dark:bg-gray-800/80 dark:border-b dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              LearnSphere
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavLink to="/courses">Courses</NavLink>
            {user ? (
              <>
                {/* --- MERGED: Added Admin Panel link --- */}
                {user.role === 'admin' && (
                  <NavLink to="/admin/dashboard">Admin Panel</NavLink>
                )}
                {user.role === 'instructor' && (
                  <NavLink to="/instructor/dashboard">Instructor Panel</NavLink>
                )}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center text-gray-600 hover:text-indigo-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:text-gray-300">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <FaUserCircle size={24} />
                    )}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-600">
                        Signed in as<br />
                        <strong className="font-medium">{user.name}</strong>
                      </div>
                      <Menu.Item>
                        {({ active }) => (
                          <Link to={dashboardPath} className={`${active ? 'bg-gray-100 dark:bg-gray-600' : ''} group flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}>
                            Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link to="/profile" className={`${active ? 'bg-gray-100 dark:bg-gray-600' : ''} group flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}>
                            Edit Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button onClick={handleLogout} className={`${active ? 'bg-gray-100 dark:bg-gray-600' : ''} group flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}>
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <Link to="/register">
                  <motion.button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Register
                  </motion.button>
                </Link>
              </>
            )}
            <div className="border-l border-gray-200 dark:border-gray-600 ml-2 pl-4">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="ml-4 dark:text-gray-200">
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col items-center space-y-2">
            <NavLink to="/courses">Courses</NavLink>
            {user ? (
              <>
                <NavLink to={dashboardPath}>Dashboard</NavLink>
                <NavLink to="/profile">Edit Profile</NavLink>
                {/* --- MERGED: Added Admin Panel link for mobile --- */}
                {user.role === 'admin' && (
                  <NavLink to="/admin/dashboard">Admin Panel</NavLink>
                )}
                {user.role === 'instructor' && (
                  <NavLink to="/instructor/dashboard">Instructor Panel</NavLink>
                )}
                <span className="font-medium text-gray-700 dark:text-gray-200 py-2">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <Link to="/register" className="w-full">
                  <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                    Register
                  </button>
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;