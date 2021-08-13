const { Router } = require('express');

const multer = require('multer');

const upload = multer({ dest: './src/uploads/' });

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
