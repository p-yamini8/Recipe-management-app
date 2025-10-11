// routes/upload.js
const express = require('express');
const { getUploadUrl } = require('../controllers/upload');
const router = express.Router();


router.get('/get-upload-url', getUploadUrl);

module.exports = router;