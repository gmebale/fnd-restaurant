const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All favorite routes require authentication
router.use(authenticate);

router.get('/', favoriteController.getFavorites);
router.post('/:productId', favoriteController.addFavorite);
router.delete('/:productId', favoriteController.removeFavorite);

module.exports = router;

