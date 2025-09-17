// src/pages/CoursesPage.js
import React, { useState, useEffect } from 'react';
import API from '../api/axios'; // 1. Import our new API client instead of axios
import { motion } from 'framer-motion';
import CourseCard from '../components/CourseCard';
import SkeletonCard from '../components/SkeletonCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // 2. Use 'API' for the request
        const { data } = await API.get('/api/courses');
        setCourses(data);
      } catch (err) {
        setError('Failed to load courses.');
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">Available Courses</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">Available Courses</h1>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default CoursesPage;