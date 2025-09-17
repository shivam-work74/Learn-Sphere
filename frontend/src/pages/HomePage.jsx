// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import { FaChalkboardTeacher, FaLaptopCode, FaQuestionCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

function HomePage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get('/api/courses');
        setCourses(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load courses.');
      }
    };
    fetchCourses();
  }, []);

  return (
    // Added dark mode background
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <motion.section 
        className="relative bg-gradient-to-r from-indigo-800 to-purple-600 text-white text-center py-20 md:py-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4">
          <motion.h1 
            className="text-4xl md:text-6xl font-extrabold drop-shadow-lg"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Learn Without Limits
          </motion.h1>
          <motion.p 
            className="mt-4 text-lg md:text-xl text-indigo-200 max-w-2xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Unlock your potential with expert-led courses. Start your learning journey with LearnSphere today and master new skills.
          </motion.p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link to="/courses">
              <button className="mt-8 bg-white text-indigo-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                Browse Courses
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Added dark mode text color */}
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Why Choose LearnSphere?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full mx-auto mb-4">
                <FaChalkboardTeacher size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Expert Instructors</h3>
              <p className="text-gray-600 dark:text-gray-400">Learn from industry professionals who are passionate about teaching.</p>
            </div>
            {/* Feature 2 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full mx-auto mb-4">
                <FaLaptopCode size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Flexible Learning</h3>
              <p className="text-gray-600 dark:text-gray-400">Access courses anytime, anywhere, and learn at your own pace.</p>
            </div>
            {/* Feature 3 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full mx-auto mb-4">
                <FaQuestionCircle size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Interactive Quizzes</h3>
              <p className="text-gray-600 dark:text-gray-400">Test your knowledge with engaging quizzes and track your progress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      {courses.length > 0 && (
        // Added dark mode background
        <section className="bg-indigo-50 dark:bg-gray-800 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Featured Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default HomePage;