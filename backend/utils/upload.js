const AWS = require("aws-sdk");

const uploadToS3 = (data, filename) => {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const SECRET_KEY = process.env.IAM_SECRET_KEY;

  const s3Bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: SECRET_KEY,
  });

  const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3Bucket.upload(params, (err, s3reponse) => {
      if (err) {
        reject(err);
      } else {
        resolve(s3reponse.Location);
      }
    });
  });
};

module.exports = uploadToS3;
