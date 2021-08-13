const AWS = require('aws-sdk');
const fs = require('fs');

class AWSUploadServices {
  constructor() {
    this.params = {
      Bucket: process.env.AWS_S3_BUCKET,
    };
    this.s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      region: process.env.AWS_REGION,
    });
  }

  getBucket(userId) {
    const params = {};
    params.Bucket = `${this.params.Bucket}/user${userId}`;

    return params;
  }

  async uploadFile(fileName, filePath, userId) {
    const fileContent = fs.readFileSync(filePath);

    const params = this.getBucket(userId);
    params.Key = fileName;
    params.Body = fileContent;

    const data = await this.s3.upload(params).promise();
    fs.unlink(filePath, () => { console.log(`${filePath} deleted!`); });
    return data.Location;
  }

  async listObjects(userId) {
    this.params.Prefix = `user${userId}/`;

    const result = await this.s3.listObjectsV2(this.params).promise();
    return result.Contents.reduce((files, item) => {
      if (item.Key !== this.params.Prefix) {
        const file = item.Key.replace(this.params.Prefix, '');
        files.push(file);
      }
      return files;
    }, []);
  }

  async getObject(userId, pdf) {
    const signedUrlExpireSeconds = 60 * 3;
    const params = this.getBucket(userId);
    params.Key = pdf;
    params.Expires = signedUrlExpireSeconds;

    const url = this.s3.getSignedUrl('getObject', params);
    return url;
  }

  async deleteObject(userId, pdf) {
    const params = this.getBucket(userId);
    params.Key = pdf;
    try {
      return await this.s3.deleteObject(params).promise();
    } catch (error) {
      return error;
    }
  }
}

const instance = new AWSUploadServices();

module.exports = {
  AWSUploadServices: instance,
};
