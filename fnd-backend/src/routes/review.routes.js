const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', reviewController.getReviews);
router.get('/product/:productId', reviewController.getProductReviews);
router.get('/stats', reviewController.getReviewStats);

// Protected routes
router.post('/', authenticate, reviewController.createReview);
router.put('/:id', authenticate, reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);

// Admin routes
router.get('/admin/all', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), reviewController.getAllReviews);
router.post('/:id/respond', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), reviewController.respondToReview);

module.exports = router;

