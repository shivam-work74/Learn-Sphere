// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios'; // Use our configured API client instead of raw axios
import { useAuth } from '../context/AuthContext';
import { FaHome, FaBook, FaChalkboardTeacher, FaUser, FaCog, FaChartLine, FaUserEdit, FaPlusCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import CourseCard from '../components/CourseCard';
import SkeletonCard from '../components/SkeletonCard';

function DashboardPage() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        // Use API.get instead of axios.get
        const { data } = await API.get('/api/courses/enrolled', config);
        setEnrolledCourses(data);
      } catch (error) {
        console.error('Failed to fetch enrolled courses');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  const stats = [
    { icon: FaBook, value: enrolledCourses.length, label: 'Enrolled Courses', color: 'text-blue-500' },
    { icon: FaChartLine, value: '85%', label: 'Avg. Progress', color: 'text-green-500' },
    { icon: FaChalkboardTeacher, value: '12', label: 'Hours Learned', color: 'text-purple-500' },
    { icon: FaUser, value: '3', label: 'Certificates', color: 'text-yellow-500' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-800 shadow-md p-6">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">LearnSphere</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Empowering Learners</p>
        </div>
        
        <nav>
          <Link to="/dashboard" className="flex items-center p-3 my-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg transition-colors duration-200">
            <FaHome className="mr-3" />
            Dashboard
          </Link>
          <Link to="/courses" className="flex items-center p-3 my-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
            <FaBook className="mr-3" />
            Browse Courses
          </Link>
          <Link to="/instructor" className="flex items-center p-3 my-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
            <FaChalkboardTeacher className="mr-3" />
            Instructor
          </Link>
          <Link to="/profile" className="flex items-center p-3 my-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
            <FaUserEdit className="mr-3" />
            Edit Profile
          </Link>
          <Link to="/settings" className="flex items-center p-3 my-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
            <FaCog className="mr-3" />
            Settings
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        <div className="p-8 mb-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg">
          <h1 className="text-4xl font-extrabold">Welcome back, {user?.name}!</h1>
          <p className="mt-2 text-indigo-200">Here are the courses you're currently enrolled in.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center">
              <div className={`text-4xl mr-4 ${stat.color}`}>
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
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Courses</h2>
            <Link to="/courses" className="flex items-center text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-300">
              <FaPlusCircle className="mr-2" />
              Enroll in a New Course
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, index) => <SkeletonCard key={index} />)}
            </div>
          ) : enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {enrolledCourses.map(course => {
                const courseProgress = user?.progress?.find(p => p.courseId === course._id);
                const completedCount = courseProgress?.completedLessons?.length || 0;
                const totalLessons = course.lessons?.length || 0;
                const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
                return <CourseCard key={course._id} course={course} progress={progressPercentage} />;
              })}
            </div>
          ) : (
            <div className="text-center p-10 text-gray-500 dark:text-gray-400">
              <p>You haven't enrolled in any courses yet.</p>
              <Link to="/courses" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;