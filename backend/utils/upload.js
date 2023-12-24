const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

function uploadToCloudinary(csvContent, filename) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "Expensify", resource_type: "raw", public_id: filename },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    const bufferStream = Buffer.from(csvContent, "utf-8");
    const readableStream = Readable.from([bufferStream]);

    readableStream.pipe(uploadStream);
  });
}

module.exports = uploadToCloudinary;
