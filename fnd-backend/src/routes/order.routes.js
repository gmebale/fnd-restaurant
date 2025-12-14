const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Protected routes
router.get('/', authenticate, orderController.getOrders);
router.get('/:id', authenticate, orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id/status', authenticate, authorize('ADMIN', 'CUISINIER', 'LIVREUR', 'SUPER_ADMIN'), orderController.updateOrderStatus);
router.put('/:id/cancel', authenticate, orderController.cancelOrder);

// Admin routes
router.get('/admin/stats', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), orderController.getOrderStats);
router.get('/admin/pending', authenticate, authorize('ADMIN', 'CUISINIER', 'SUPER_ADMIN'), orderController.getPendingOrders);
router.get('/admin/ready', authenticate, authorize('ADMIN', 'LIVREUR', 'SUPER_ADMIN'), orderController.getReadyOrders);
router.get('/admin/all', authenticate, authorize('ADMIN', 'CUISINIER', 'LIVREUR', 'SUPER_ADMIN'), orderController.getAllOrders);

module.exports = router;

