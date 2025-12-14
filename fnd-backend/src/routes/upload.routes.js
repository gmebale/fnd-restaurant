const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Protected routes
router.post('/image', authenticate, upload.single('image'), uploadController.uploadImage);
router.post('/images', authenticate, upload.array('images', 5), uploadController.uploadImages);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), uploadController.deleteFile);

module.exports = router;

