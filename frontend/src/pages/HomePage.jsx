// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios'; // Use our configured API client instead of raw axios
import { useAuth } from '../context/AuthContext';
import { FaBookOpen, FaClock, FaQuestionCircle, FaStar, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';
import { motion } from 'framer-motion';
import CourseCard from '../components/CourseCard';

function HomePage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Use API.get instead of axios.get
        const { data } = await API.get('/api/courses');
        // Get only the first 3 courses for the featured section
        setCourses(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <motion.div
            className="max-w-3xl"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1 className="text-4xl md:text-6xl font-extrabold mb-6" variants={itemVariants}>
              Unlock Your Potential with <span className="text-yellow-300">LearnSphere</span>
            </motion.h1>
            <motion.p className="text-xl mb-10 text-indigo-100" variants={itemVariants}>
              Discover a world of knowledge with our expertly crafted courses. Learn at your own pace, anytime, anywhere.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-4" variants={itemVariants}>
              {user ? (
                <Link to="/dashboard" className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 text-center">
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/register" className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 text-center">
                  Join for Free
                </Link>
              )}
              <Link to="/courses" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-indigo-600 transition duration-300 text-center">
                Explore Courses
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">10K+</p>
              <p className="text-gray-600 dark:text-gray-400">Active Learners</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">200+</p>
              <p className="text-gray-600 dark:text-gray-400">Expert Courses</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">50+</p>
              <p className="text-gray-600 dark:text-gray-400">Instructors</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">98%</p>
              <p className="text-gray-600 dark:text-gray-400">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">Why Choose LearnSphere?</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            We provide the tools and resources you need to achieve your learning goals.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full mx-auto mb-4">
                <FaBookOpen size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Expert Instructors</h3>
              <p className="text-gray-600 dark:text-gray-400">Learn from industry experts with years of practical experience.</p>
            </div>
            {/* Feature 2 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full mx-auto mb-4">
                <FaClock size={32} />
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Learning Journey Today</h2>
          <p className="text-xl mb-10 text-indigo-100 max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers with our courses.
          </p>
          {user ? (
            <Link to="/dashboard" className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300">
              Continue Learning
            </Link>
          ) : (
            <Link to="/register" className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300">
              Get Started for Free
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;