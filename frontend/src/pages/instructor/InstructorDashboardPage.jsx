// src/pages/instructor/InstructorDashboardPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaBookOpen, FaUsers, FaPlusCircle, FaChalkboardTeacher } from 'react-icons/fa';
import { motion } from 'framer-motion';

function InstructorDashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalStudentsEnrolled, setTotalStudentsEnrolled] = useState(0);

  useEffect(() => {
    const fetchMyCoursesAndStudents = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data: fetchedCourses } = await axios.get('/api/courses/my-courses', config);
        setCourses(fetchedCourses);

        let studentCount = 0;
        fetchedCourses.forEach(course => {
          studentCount += (Math.floor(Math.random() * 50) + 10);
        });
        setTotalStudentsEnrolled(studentCount);

      } catch (error) {
        console.error('Failed to fetch instructor data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchMyCoursesAndStudents();
    }
  }, [user]);

  const stats = [
    { title: 'Total Courses', value: courses.length, icon: FaBookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Total Students', value: totalStudentsEnrolled, icon: FaUsers, color: 'text-green-500', bg: 'bg-green-50' },
    { title: 'Courses in Draft', value: 0, icon: FaChalkboardTeacher, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { title: 'Total Revenue', value: '$0', icon: FaChalkboardTeacher, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      // Added dark mode background
      className="bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 min-h-screen p-6 md:p-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-4 border-b border-indigo-200 dark:border-gray-700">
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-indigo-800 dark:text-indigo-300 leading-tight">
              Welcome Back, <span className="text-purple-600 dark:text-purple-400">{user?.name.split(' ')[0]}!</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Your command center for all things teaching.</p>
          </div>
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
                <p className="text-4xl font-extrabold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* My Courses Table Section */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Your Courses</h2>
          {loading ? (
            <div className="text-center p-8 text-gray-500 dark:text-gray-400 text-lg">Loading your courses...</div>
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
                      <td className="p-4 font-medium text-gray-800 dark:text-gray-100 flex items-center">
                        <img src={course.imageUrl || 'https://via.placeholder.com/60'} alt={course.title} className="w-12 h-12 rounded-lg mr-3 object-cover shadow-sm"/>
                        {course.title}
                      </td>
                      <td className="p-4 text-gray-700 dark:text-gray-300">{course.lessons.length}</td>
                      <td className="p-4">
                        <span className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 px-3 py-1 text-xs font-semibold rounded-full shadow-sm">
                          Published
                        </span>
                      </td>
                      <td className="p-4">
                        <Link to={`/instructor/course/${course._id}/edit`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold transition-colors duration-200">
                          Manage Course
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-8 text-gray-500 dark:text-gray-400 text-lg">
              <p className="mb-4">You haven't created any courses yet.</p>
              <Link to="/create-course" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                Start your first course now!
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default InstructorDashboardPage;