const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');
const serverless = require('serverless-http');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('../src/routes/auth.routes');
const productRoutes = require('../src/routes/product.routes');
const orderRoutes = require('../src/routes/order.routes');
const cartRoutes = require('../src/routes/cart.routes');
const favoriteRoutes = require('../src/routes/favorite.routes');
const reviewRoutes = require('../src/routes/review.routes');
const loyaltyRoutes = require('../src/routes/loyalty.routes');
const promoRoutes = require('../src/routes/promo.routes');
const chatRoutes = require('../src/routes/chat.routes');
const notificationRoutes = require('../src/routes/notification.routes');
const adminRoutes = require('../src/routes/admin.routes');
const uploadRoutes = require('../src/routes/upload.routes');

// Import middleware
const errorHandler = require('../src/middleware/errorHandler.middleware');
const logger = require('../src/utils/logger');

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['https://fnd-frontend.vercel.app', /\.vercel\.app$/],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export for Vercel
module.exports = serverless(app);

// For local development

