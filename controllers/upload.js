// controllers/upload.js
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: 'v4',
});

exports.getUploadUrl = async (req, res) => {
  try {
    const fileType = req.query.fileType || "image/jpeg"; // ✅ match frontend file.type
    const fileExt = fileType.split("/")[1]; // jpeg, png, etc.
    const fileName = `${uuidv4()}.${fileExt}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${fileName}`,
      Expires: 300,
    
      ContentType: fileType
    };

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${fileName}`;

    return res.json({ uploadURL, imageUrl });
  } catch (err) {
    console.error('Error generating upload URL:', err);
    res.status(500).json({ message: 'Error generating upload URL', error: err.toString() });
  }
};