const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/popular', productController.getPopularProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getProductById);

// Protected routes - Admin only
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), productController.createProduct);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), productController.updateProduct);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), productController.deleteProduct);
router.post('/:id/image', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), productController.uploadImage);

module.exports = router;

