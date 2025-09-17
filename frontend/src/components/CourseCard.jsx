// src/components/CourseCard.js
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function CourseCard({ course, progress }) {
  const { user } = useAuth();
  const isEnrolled = user?.enrolledCourses?.includes(course._id);

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.03, y: -5 }}
      // Added dark mode background
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 flex flex-col"
    >
      <img className="w-full h-48 object-cover" src={course.imageUrl} alt={course.title} />
      <div className="p-6 flex flex-col flex-grow">
        {/* Added dark mode text colors */}
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{course.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">By {course.instructor?.name || 'Unknown'}</p>
        <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">{course.description}</p>
        
        {progress != null && (
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-400">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {isEnrolled ? (
          <Link to={`/learn/${course._id}`} className="w-full text-center bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition-colors duration-300">
            Go to Course
          </Link>
        ) : (
          <Link to={`/course/${course._id}`} className="w-full text-center bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
            View Course
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export default CourseCard;