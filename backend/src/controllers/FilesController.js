const fs = require('fs');
const { AWSUploadServices } = require('../services/AWSUploadServices');

class FilesController {
  async validateUploadRequest(request, response, next) {
    if (!request.userId) {
      return response.status(401).json({
        error: 'Unauthorized!',
      });
    }

    if (!request.file) {
      return response.status(400).json({
        error: 'File not found!',
      });
    }

    if (request.file.mimetype !== 'application/pdf') {
      fs.unlink(request.file.path, () => {
        console.log(`${request.file.path} deleted!`);
      });
      return response.status(400).json({
        error: 'Format not valid! Please send only pdf files!',
      });
    }

    return next();
  }

  async uploadFile(request, response) {
    try {
      const { originalname, path } = request.file;
      const { userId } = request;

      await AWSUploadServices.uploadFile(originalname, path, userId);

      response.json({ status: 'ok' });
    } catch (error) {
      response.status(500).json({
        error: error.message,
      });
    }
  }

  async getFilesList(request, response) {
    if (!request.userId) {
      return response.status(401).json({
        error: 'Unauthorized!',
      });
    }

    try {
      const { userId } = request;
      const files = await AWSUploadServices.listObjects(userId);

      return response.json({
        files,
      });
    } catch (error) {
      return response.status(500).json({
        error: error.message,
      });
    }
  }

  async downloadFile(request, response) {
    if (!request.userId) {
      return response.status(401).json({
        error: 'Unauthorized!',
      });
    }
    if (!request.params.pdf) {
      return response.status(400).json({
        error: 'Missing pdf file!',
      });
    }

    const { userId } = request;
    const { pdf } = request.params;

    const url = await AWSUploadServices.getObject(userId, pdf);
    return response.json({ url });
  }

  async deleteFile(request, response) {
    if (!request.userId) {
      return response.status(401).json({
        error: 'Unauthorized!',
      });
    }
    if (!request.params.pdf) {
      return response.status(400).json({
        error: 'Missing pdf file!',
      });
    }

    const { userId } = request;
    const { pdf } = request.params;

    const result = await AWSUploadServices.deleteObject(userId, pdf);
    return response.json({ result });
  }
}

module.exports = FilesController;
