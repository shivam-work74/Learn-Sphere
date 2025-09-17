// backend/routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { uploadImage } = require('../controllers/uploadController'); // 1. Import the new controller
const router = express.Router();

// 2. Configure multer to store files in memory as buffers
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 3. Use the uploadImage controller to handle the logic
router.post('/', protect, upload.single('image'), uploadImage);

module.exports = router;

























