const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

// Dashboard stats
router.get('/stats/dashboard', adminController.getDashboardStats);
router.get('/stats/sales', adminController.getSalesStats);
router.get('/stats/products', adminController.getProductStats);
router.get('/stats/orders', adminController.getOrderStats);
router.get('/stats/users', adminController.getUserStats);
router.get('/stats/finances', adminController.getFinanceStats);

// Reports
router.get('/reports/sales', adminController.getSalesReport);
router.get('/reports/products', adminController.getProductReport);

// Staff management
router.get('/staff', adminController.getStaff);
router.post('/staff', adminController.createStaff);
router.put('/staff/:id', adminController.updateStaff);
router.delete('/staff/:id', adminController.deleteStaff);

module.exports = router;

