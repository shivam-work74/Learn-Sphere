// src/pages/admin/AdminDashboardPage.js
import React, { useState, useEffect, useCallback } from 'react';
import API from '../../api/axios'; // 1. FIX: Import our new API client instead of axios
import { useAuth } from '../../context/AuthContext';
import { FaUsers, FaTrash, FaBook, FaChalkboardTeacher } from 'react-icons/fa';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

function AdminDashboardPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  const fetchData = useCallback(async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      // 2. FIX: Use 'API' for all requests
      const [usersRes, coursesRes] = await Promise.all([
        API.get('/api/admin/users', config),
        API.get('/api/admin/courses', config)
      ]);
      setUsers(usersRes.data);
      setCourses(coursesRes.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data.');
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) { fetchData(); }
  }, [user, fetchData]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await API.delete(`/api/admin/users/${userId}`, config);
        toast.success('User deleted successfully');
        fetchData();
      } catch (error) { toast.error(error.response?.data?.message || 'Failed to delete user.'); }
    }
  };
  
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await API.delete(`/api/admin/courses/${courseId}`, config);
        toast.success('Course deleted successfully');
        fetchData();
      } catch (error) { toast.error('Failed to delete course.'); }
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await API.put(`/api/admin/users/${userId}/role`, { role: newRole }, config);
      toast.success("User role updated!");
      fetchData();
    } catch (error) { toast.error(error.response?.data?.message || "Failed to update role."); }
  };

  const instructorCount = users.filter(u => u.role === 'instructor').length;

  // 3. FIX: Added a top-level loading check to use the 'loading' variable
  if (loading) {
    return <div className="text-center p-10 dark:text-white">Loading Admin Data...</div>;
  }

  return (
    <motion.div 
      className="container mx-auto p-6 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-4xl font-bold mb-6 dark:text-white">Admin Command Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center"><FaUsers className="text-4xl text-blue-500 mr-4" /><div><p className="text-3xl font-bold text-gray-800 dark:text-white"><CountUp end={users.length} /></p><p className="text-gray-500 dark:text-gray-400">Total Users</p></div></div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center"><FaChalkboardTeacher className="text-4xl text-green-500 mr-4" /><div><p className="text-3xl font-bold text-gray-800 dark:text-white"><CountUp end={instructorCount} /></p><p className="text-gray-500 dark:text-gray-400">Instructors</p></div></div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center"><FaBook className="text-4xl text-purple-500 mr-4" /><div><p className="text-3xl font-bold text-gray-800 dark:text-white"><CountUp end={courses.length} /></p><p className="text-gray-500 dark:text-gray-400">Total Courses</p></div></div>
      </div>
      
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-6">
          <button onClick={() => setActiveTab('users')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'users' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Manage Users</button>
          <button onClick={() => setActiveTab('courses')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'courses' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Manage Courses</button>
        </nav>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="p-4 font-semibold dark:text-gray-300">Name</th>
                  <th className="p-4 font-semibold dark:text-gray-300">Email</th>
                  <th className="p-4 font-semibold dark:text-gray-300">Role</th>
                  <th className="p-4 font-semibold dark:text-gray-300">Joined</th>
                  <th className="p-4 font-semibold dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b dark:border-gray-700">
                    <td className="p-4 flex items-center dark:text-gray-200"><img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full mr-3 object-cover"/>{u.name}</td>
                    <td className="p-4 dark:text-gray-300">{u.email}</td>
                    <td className="p-4">
                      <select value={u.role} onChange={(e) => handleChangeRole(u._id, e.target.value)} disabled={u.role === 'admin'} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                        <option value="student">student</option>
                        <option value="instructor">instructor</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="p-4 dark:text-gray-300">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">{u.role !== 'admin' && <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'courses' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="p-4 font-semibold dark:text-gray-300">Title</th>
                  <th className="p-4 font-semibold dark:text-gray-300">Instructor</th>
                  <th className="p-4 font-semibold dark:text-gray-300">Lessons</th>
                  <th className="p-4 font-semibold dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course._id} className="border-b dark:border-gray-700">
                    <td className="p-4 dark:text-gray-200">{course.title}</td>
                    <td className="p-4 dark:text-gray-300">{course.instructor?.name || 'N/A'}</td>
                    <td className="p-4 dark:text-gray-300">{course.lessons.length}</td>
                    <td className="p-4"><button onClick={() => handleDeleteCourse(course._id)} className="text-red-500 hover:text-red-700"><FaTrash /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default AdminDashboardPage;