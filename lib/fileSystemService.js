import AWS from 'aws-sdk';

const spacesEndPoint = new AWS.Endpoint(process.env.FILE_SYSTEM_S3_URL);
const s3 = new AWS.S3({
  endpoint: spacesEndPoint,
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
});
