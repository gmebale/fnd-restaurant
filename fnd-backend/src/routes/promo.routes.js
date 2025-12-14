const express = require('express');
const router = express.Router();
const promoController = require('../controllers/promo.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Public route
router.post('/validate', promoController.validatePromoCode);

// Protected routes - Admin only
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), promoController.getPromoCodes);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), promoController.createPromoCode);
router.put('/:code', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), promoController.updatePromoCode);
router.delete('/:code', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), promoController.deletePromoCode);

module.exports = router;

