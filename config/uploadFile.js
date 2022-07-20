const res = require('express/lib/response');
const cloudinary = require('./cloudinary.js');

exports.uploadCloudinary = async (file, next) => {
  const result = await cloudinary.uploader.upload(file);
  if(!result){
    return res.status(404).json('File not uploaded');
  }
  
}