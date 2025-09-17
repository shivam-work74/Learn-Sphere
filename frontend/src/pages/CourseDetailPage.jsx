// src/pages/CourseDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios'; // 1. Import our new API client instead of axios
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function CourseDetailPage() {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // 2. Use 'API' for the request
        const { data } = await API.get(`/api/courses/${id}`);
        setCourse(data);
      } catch (err) {
        setError('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (user && user.enrolledCourses?.find(courseId => courseId === id)) {
      setIsEnrolled(true);
    } else {
      setIsEnrolled(false);
    }
  }, [user, id]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setEnrollLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      // 2. Use 'API' for the request
      const { data } = await API.post(`/api/users/enroll/${id}`, {}, config);
      updateUser(data);
      toast.success('Successfully enrolled!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to enroll.');
    } finally {
      setEnrollLoading(false);
    }
  };

  if (loading) return <div className="text-center p-10 dark:text-white">Loading course...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!course) return <div className="text-center p-10 dark:text-white">Course not found.</div>;

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <header className="bg-indigo-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold mb-2">{course.title}</h1>
          <p className="text-lg text-indigo-200 max-w-3xl">{course.description}</p>
          <p className="mt-4">Created by <span className="font-semibold">{course.instructor?.name || 'Unknown Instructor'}</span></p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">What you'll learn</h2>
            <p className="dark:text-gray-300">(Course content will be added here in a future step).</p>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden sticky top-24">
              <img src={course.imageUrl} alt={course.title} className="w-full h-56 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4 dark:text-white">FREE</h3>
                {isEnrolled ? (
                  <Link to={`/learn/${course._id}`} className="block w-full text-center bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors duration-300">
                    Go to Course
                  </Link>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrollLoading}
                    className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrollLoading ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                )}
                <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">✓ 10 hours on-demand video</li>
                  <li className="flex items-center">✓ Full lifetime access</li>
                  <li className="flex items-center">✓ Certificate of completion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CourseDetailPage;