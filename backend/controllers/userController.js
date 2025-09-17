// backend/controllers/userController.js
const User = require('../models/User');
const Course = require('../models/Course');

// @desc    Enroll user in a course
// @route   POST /api/users/enroll/:courseId
// @access  Private
const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(req.user._id);
    if (user.enrolledCourses.includes(req.params.courseId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    user.enrolledCourses.push(course._id);
    await user.save();
    
    const token = req.headers.authorization.split(' ')[1];
    const updatedUser = await User.findById(req.user._id).select('-password');
    res.json({
      _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
      role: updatedUser.role, avatar: updatedUser.avatar, 
      enrolledCourses: updatedUser.enrolledCourses, progress: updatedUser.progress, token,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user's enrolled courses
// @route   GET /api/users/my-courses
// @access  Private
const getMyEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'enrolledCourses',
      populate: { path: 'instructor', select: 'name' },
    });
    res.json(user.enrolledCourses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.name = req.body.name || user.name;
      user.avatar = req.body.avatar || user.avatar;
      
      const updatedUser = await user.save();
      const token = req.headers.authorization.split(' ')[1];
      
      res.json({
        _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
        role: updatedUser.role, avatar: updatedUser.avatar,
        enrolledCourses: updatedUser.enrolledCourses, progress: updatedUser.progress, token,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
const changeUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password changed successfully' });
    } else {
      res.status(401).json({ message: 'Invalid current password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- NEW FUNCTION MERGED IN ---
// @desc    Mark a lesson as complete for a user
// @route   POST /api/users/progress
// @access  Private
const markLessonAsComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      const courseProgress = user.progress.find(p => p.courseId.toString() === courseId);

      if (courseProgress) {
        if (!courseProgress.completedLessons.includes(lessonId)) {
          courseProgress.completedLessons.push(lessonId);
        }
      } else {
        user.progress.push({ courseId, completedLessons: [lessonId] });
      }

      await user.save();
      
      const token = req.headers.authorization.split(' ')[1];
      const updatedUser = await User.findById(req.user._id).select('-password');
       res.json({
        _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
        role: updatedUser.role, avatar: updatedUser.avatar, 
        enrolledCourses: updatedUser.enrolledCourses, progress: updatedUser.progress, token,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- EXPORTS UPDATED ---
module.exports = { 
  enrollInCourse, 
  getMyEnrolledCourses, 
  updateUserProfile,
  changeUserPassword,
  markLessonAsComplete
};