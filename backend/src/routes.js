const { Router } = require('express');

const fs = require('fs');
const multer = require('multer');

const dirUpload = './src/uploads/';
if (!fs.existsSync(dirUpload)) {
  fs.mkdirSync(dirUpload);
}

const upload = multer({ dest: dirUpload });

const routes = Router();

const AuthController = require('./controllers/AuthController');
const FilesController = require('./controllers/FilesController');

const authController = new AuthController();
const filesController = new FilesController();

routes.post('/login', authController.login);

routes.get('/pdf', authController.validateJWT, filesController.getFilesList);
routes.delete('/pdf/:pdf', authController.validateJWT, filesController.deleteFile);

routes.get('/download/:pdf', authController.validateJWT, filesController.downloadFile);

routes.post('/pdf',
  authController.validateJWT,
  upload.single('pdf'),
  filesController.validateUploadRequest,
  filesController.uploadFile);

module.exports = {
  routes,
};
