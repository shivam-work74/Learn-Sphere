// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react'; // This line is now corrected
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import SkeletonCard from '../components/SkeletonCard';
import { Link } from 'react-router-dom';
import { FaBook, FaUserEdit, FaCog, FaPlusCircle, FaCheckCircle, FaCertificate } from 'react-icons/fa';
import CountUp from 'react-countup';

function DashboardPage() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedCoursesCount, setCompletedCoursesCount] = useState(0);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (user) {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.get('/api/users/my-courses', config);
          setEnrolledCourses(data);

          let completedCount = 0;
          data.forEach(course => {
            const courseProgress = user.progress?.find(p => p.courseId === course._id);
            if (courseProgress) {
              const totalLessons = course.lessons?.length || 0;
              const completedLessons = courseProgress.completedLessons?.length || 0;
              if (totalLessons > 0 && completedLessons === totalLessons) {
                completedCount++;
              }
            }
          });
          setCompletedCoursesCount(completedCount);

        } catch (error) {
          console.error('Failed to fetch enrolled courses');
        } finally {
          setTimeout(() => setLoading(false), 500);
        }
      }
    };
    fetchEnrolledCourses();
  }, [user]);

  const stats = [
    { title: 'Courses Enrolled', value: enrolledCourses.length, icon: FaBook, color: 'text-blue-500' },
    { title: 'Courses Completed', value: completedCoursesCount, icon: FaCheckCircle, color: 'text-green-500' },
    { title: 'Certificates Earned', value: 0, icon: FaCertificate, color: 'text-yellow-500' },
  ];

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 min-h-full">
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex items-center justify-center h-20 border-b dark:border-gray-700">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            LearnSphere
          </Link>
        </div>
        <nav className="flex-grow p-4">
          <Link to="/dashboard" className="flex items-center p-3 my-2 text-gray-700 dark:text-gray-100 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg font-semibold">
            <FaBook className="mr-3 text-indigo-600" />
            My Courses
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
                  {loading ? '...' : <CountUp end={stat.value} duration={2} />}
                </p>
                <p className="text-gray-500 dark:text-gray-400">{stat.title}</p>
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
            <div className="text-center py-10 px-6">
              <img 
                src="https://res.cloudinary.com/demo/image/upload/v1642601704/undraw_road_to_knowledge_m8s0.svg" 
                alt="No courses" 
                className="w-1/2 md:w-1/3 mx-auto mb-6"
              />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Your learning journey awaits!</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">You are not yet enrolled in any courses.</p>
              <Link to="/courses" className="bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
                Explore Courses
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;