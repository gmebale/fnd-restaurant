const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All chat routes require authentication
router.use(authenticate);

router.get('/orders/:orderId', chatController.getOrderMessages);
router.post('/orders/:orderId', chatController.sendMessage);
router.get('/unread', chatController.getUnreadMessages);
router.put('/messages/:id/read', chatController.markAsRead);

module.exports = router;

