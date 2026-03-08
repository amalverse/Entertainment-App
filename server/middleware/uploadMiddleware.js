const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure storage to memory for Base64 conversion
const storage = multer.memoryStorage();

// Filter to allow only image files for security
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
});

module.exports = upload;
