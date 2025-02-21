const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadImageToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "defaultFolder" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = { uploadImageToCloudinary };
