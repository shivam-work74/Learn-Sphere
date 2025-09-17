// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
// 1. Import the new controller function
const { 
  enrollInCourse, 
  getMyEnrolledCourses, 
  updateUserProfile,
  changeUserPassword,
  markLessonAsComplete
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/enroll/:courseId').post(protect, enrollInCourse);
router.route('/my-courses').get(protect, getMyEnrolledCourses);
router.route('/profile').put(protect, updateUserProfile);
router.route('/change-password').put(protect, changeUserPassword);

// 2. Add the new route for saving progress
router.route('/progress').post(protect, markLessonAsComplete);

module.exports = router;