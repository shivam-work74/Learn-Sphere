// src/pages/instructor/InstructorDashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios'; // Use our configured API client instead of raw axios
import { useAuth } from '../../context/AuthContext';
import { FaBook, FaChalkboardTeacher, FaUsers, FaChartLine, FaPlusCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SkeletonCard from '../../components/SkeletonCard';

function InstructorDashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        // Use API.get instead of axios.get
        const { data } = await API.get('/api/courses/my-courses', config);
        setCourses(data);
      } catch (error) {
        console.error('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyCourses();
    }
  }, [user]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const stats = [
    { icon: FaBook, value: courses.length, label: 'Courses', color: 'text-blue-500' },
    { icon: FaUsers, value: '1.2K', label: 'Students', color: 'text-green-500' },
    { icon: FaChalkboardTeacher, value: '24', label: 'Lessons', color: 'text-purple-500' },
    { icon: FaChartLine, value: '4.8', label: 'Avg. Rating', color: 'text-yellow-500' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Welcome Back, <span className="text-purple-600 dark:text-purple-400">{user?.name.split(' ')[0]}!</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Your command center for all things teaching.</p>
        </motion.div>
        <Link to="/create-course">
          <motion.button
            className="mt-6 md:mt-0 flex items-center bg-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlusCircle className="mr-3 text-xl" />
            Create New Course
          </motion.button>
        </Link>
      </motion.div>

      {/* Stats Cards Section */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants} className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
            <div className={`text-5xl ${stat.color} mr-5`}>
              {React.createElement(stat.icon)}
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  {stat.value}
                </motion.span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* My Courses Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Courses</h2>
          <Link to="/instructor/my-courses" className="text-indigo-600 dark:text-indigo-400 hover:underline">View All</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm md:text-base">Title</th>
                  <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm md:text-base">Lessons</th>
                  <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm md:text-base">Status</th>
                  <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm md:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <motion.tr
                    key={course._id}
                    variants={itemVariants}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200 text-sm md:text-base">{course.title}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 text-sm md:text-base">{course.lessons.length}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full dark:bg-green-900 dark:text-green-200">
                        Published
                      </span>
                    </td>
                    <td className="p-4">
                      <Link 
                        to={`/instructor/course/${course._id}/edit`} 
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium"
                      >
                        Edit
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-12">
            <FaChalkboardTeacher className="mx-auto text-5xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Courses Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by creating your first course.</p>
            <Link 
              to="/create-course" 
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300"
            >
              <FaPlusCircle className="mr-2" />
              Create Course
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default InstructorDashboardPage;