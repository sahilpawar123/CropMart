const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dl2jifmi2', // <-- Paste your Cloud Name here
  api_key: '543877444167582',       // <-- Paste your API Key here
  api_secret: 'YQxkNfnJ-EWtK4hpWuJzin_dHyo'  // <-- Paste your API Secret here
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'agribid', // A folder name in your Cloudinary account
    allowed_formats: ['jpeg', 'png', 'jpg']
  }
});

module.exports = {
  cloudinary,
  storage
};