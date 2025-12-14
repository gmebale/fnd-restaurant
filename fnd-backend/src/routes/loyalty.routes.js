const express = require('express');
const router = express.Router();
const loyaltyController = require('../controllers/loyalty.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All loyalty routes require authentication
router.use(authenticate);

router.get('/points', loyaltyController.getPoints);
router.get('/history', loyaltyController.getHistory);
router.post('/redeem', loyaltyController.redeemPoints);
router.get('/rules', loyaltyController.getRules);

module.exports = router;

