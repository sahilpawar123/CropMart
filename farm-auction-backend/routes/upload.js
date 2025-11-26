const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

// This route will handle the image upload from the frontend
// It expects a single file in a field named 'image'
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  // req.file.path contains the permanent URL from Cloudinary
  res.json({ url: req.file.path });
});

module.exports = router;