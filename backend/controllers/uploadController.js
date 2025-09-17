// backend/controllers/uploadController.js
const cloudinary = require('../config/cloudinary');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'learnsphere_avatars',
    });

    res.json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
    });

  } catch (error) {
    console.error('CLOUDINARY UPLOAD ERROR:', error);
    res.status(500).json({ message: `Upload failed: ${error.message}` });
  }
};

module.exports = { uploadImage };