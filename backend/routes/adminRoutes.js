// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
// 1. Import the new controller functions
const { 
  getAllUsers, 
  deleteUser,
  getAllCourses,
  deleteCourse,
  changeUserRole
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// User Management Routes
router.route('/users').get(protect, isAdmin, getAllUsers);
router.route('/users/:id').delete(protect, isAdmin, deleteUser);
router.route('/users/:id/role').put(protect, isAdmin, changeUserRole); // 2. Add route to change role

// Course Management Routes
router.route('/courses').get(protect, isAdmin, getAllCourses); // 3. Add route to get all courses
router.route('/courses/:id').delete(protect, isAdmin, deleteCourse); // 4. Add route to delete a course

module.exports = router;