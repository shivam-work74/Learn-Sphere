// src/pages/instructor/MyCoursesPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

function MyCoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/courses/my-courses', config);
        setCourses(data);
      } catch (error) { console.error('Failed to fetch courses'); } 
      finally { setLoading(false); }
    };
    if (user) { fetchMyCourses(); }
  }, [user]);

  if (loading) return <div className="text-center p-10 dark:text-white">Loading your courses...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">My Courses</h1>
        <Link to="/create-course" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700">
          Create New Course
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <img src={course.imageUrl} alt={course.title} className="rounded-md mb-4 h-40 w-full object-cover"/>
            <h2 className="text-xl font-bold dark:text-white">{course.title}</h2>
            <Link to={`/instructor/course/${course._id}/edit`} className="text-indigo-600 dark:text-indigo-400 hover:underline mt-4 inline-block">
              Manage Course
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyCoursesPage;