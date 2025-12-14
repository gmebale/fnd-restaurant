import axios from 'axios';
import { API_BASE_URL, getToken, setTokens, removeTokens } from '../config/api.config';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('fnd_refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          setTokens(accessToken, newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        removeTokens();
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============================================
// AUTHENTICATION
// ============================================

export async function register(userData) {
  const response = await api.post('/auth/register', userData);
  if (response.data.accessToken) {
    setTokens(response.data.accessToken, response.data.refreshToken);
    if (response.data.user) {
      localStorage.setItem('fnd_user', JSON.stringify(response.data.user));
    }
  }
  return response.data;
}

export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.accessToken) {
    setTokens(response.data.accessToken, response.data.refreshToken);
    if (response.data.user) {
      localStorage.setItem('fnd_user', JSON.stringify(response.data.user));
    }
  }
  return response.data;
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    removeTokens();
  }
}

export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data;
}

export async function refreshToken() {
  const refreshToken = localStorage.getItem('fnd_refresh_token');
  const response = await api.post('/auth/refresh', { refreshToken });
  if (response.data.accessToken) {
    setTokens(response.data.accessToken, response.data.refreshToken);
  }
  return response.data;
}

export async function updateProfile(userData) {
  const response = await api.put('/auth/profile', userData);
  return response.data;
}

// ============================================
// PRODUCTS
// ============================================

export async function fetchProducts({ category } = {}) {
  const params = category && category !== 'Tous' ? { category } : {};
  const response = await api.get('/products', { params });
  return response.data;
}

export async function fetchPopular() {
  const response = await api.get('/products/popular');
  return response.data;
}

export async function fetchProductById(id) {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

export async function fetchProductsByIds(ids = []) {
  // Fetch products individually or implement batch endpoint
  const promises = ids.map(id => api.get(`/products/${id}`).catch(() => null));
  const results = await Promise.all(promises);
  return results.filter(r => r !== null).map(r => r.data);
}

export async function createProduct(data) {
  const response = await api.post('/products', data);
  return response.data;
}

export async function updateProduct(id, changes) {
  const response = await api.put(`/products/${id}`, changes);
  return response.data;
}

export async function deleteProduct(id) {
  await api.delete(`/products/${id}`);
  return true;
}

// ============================================
// ORDERS
// ============================================

export async function createOrder(orderData) {
  const response = await api.post('/orders', orderData);
  return response.data;
}

export async function fetchOrders() {
  const response = await api.get('/orders');
  return response.data;
}

export async function fetchOrderById(id) {
  const response = await api.get(`/orders/${id}`);
  return response.data;
}

export async function updateOrderStatus(id, status) {
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data;
}

export async function cancelOrder(id) {
  const response = await api.put(`/orders/${id}/cancel`);
  return response.data;
}

export async function getPendingOrders() {
  const response = await api.get('/orders/admin/pending');
  return response.data;
}

export async function getReadyOrders() {
  const response = await api.get('/orders/admin/ready');
  return response.data;
}

export async function getAllOrders() {
  const response = await api.get('/orders/admin/all');
  return response.data;
}

// ============================================
// CART
// ============================================

export async function getCart() {
  const response = await api.get('/cart');
  return response.data;
}

export async function addToCart(productId, quantity = 1) {
  const response = await api.post('/cart/items', { productId, quantity });
  return response.data;
}

export async function updateCartItem(itemId, quantity) {
  const response = await api.put(`/cart/items/${itemId}`, { quantity });
  return response.data;
}

export async function removeFromCart(itemId) {
  await api.delete(`/cart/items/${itemId}`);
  return true;
}

export async function clearCart() {
  await api.delete('/cart');
  return true;
}

export async function validateCart() {
  const response = await api.post('/cart/validate');
  return response.data;
}

// ============================================
// FAVORITES
// ============================================

export async function fetchFavorites() {
  const response = await api.get('/favorites');
  return response.data;
}

export async function toggleFavorite(productId) {
  try {
    // Try to add first
    await api.post(`/favorites/${productId}`);
    return true;
  } catch (error) {
    if (error.response?.status === 409) {
      // Already favorite, remove it
      await api.delete(`/favorites/${productId}`);
      return false;
    }
    throw error;
  }
}

export async function addFavorite(productId) {
  await api.post(`/favorites/${productId}`);
  return true;
}

export async function removeFavorite(productId) {
  await api.delete(`/favorites/${productId}`);
  return true;
}

// ============================================
// REVIEWS
// ============================================

export async function submitReview({ orderId, rating, comment, productId }) {
  const response = await api.post('/reviews', {
    orderId,
    rating,
    comment,
    productId,
  });
  return response.data;
}

export async function fetchReviews() {
  const response = await api.get('/reviews');
  return response.data;
}

export async function fetchProductReviews(productId) {
  const response = await api.get(`/reviews/product/${productId}`);
  return response.data;
}

export async function updateReview(id, data) {
  const response = await api.put(`/reviews/${id}`, data);
  return response.data;
}

export async function deleteReview(id) {
  await api.delete(`/reviews/${id}`);
  return true;
}

// ============================================
// LOYALTY POINTS
// ============================================

export async function getLoyaltyPoints() {
  const response = await api.get('/loyalty/points');
  return response.data;
}

export async function getLoyaltyHistory() {
  const response = await api.get('/loyalty/history');
  return response.data;
}

export async function redeemPoints(points, type, productId) {
  const response = await api.post('/loyalty/redeem', {
    points,
    type, // 'discount', 'free_product', 'free_delivery'
    productId,
  });
  return response.data;
}

export async function getLoyaltyRules() {
  const response = await api.get('/loyalty/rules');
  return response.data;
}

// ============================================
// PROMO CODES
// ============================================

export async function validatePromoCode(code, orderTotal) {
  const response = await api.post('/promos/validate', { code, orderTotal });
  return response.data;
}

export async function getPromoCodes() {
  const response = await api.get('/promos');
  return response.data;
}

export async function createPromoCode(data) {
  const response = await api.post('/promos', data);
  return response.data;
}

export async function updatePromoCode(code, data) {
  const response = await api.put(`/promos/${code}`, data);
  return response.data;
}

export async function deletePromoCode(code) {
  await api.delete(`/promos/${code}`);
  return true;
}

// ============================================
// CHAT
// ============================================

export async function getOrderMessages(orderId) {
  const response = await api.get(`/chat/orders/${orderId}`);
  return response.data;
}

export async function sendMessage(orderId, content) {
  const response = await api.post(`/chat/orders/${orderId}`, { content });
  return response.data;
}

export async function getUnreadMessages() {
  const response = await api.get('/chat/unread');
  return response.data;
}

export async function markMessageAsRead(messageId) {
  const response = await api.put(`/chat/messages/${messageId}/read`);
  return response.data;
}

// ============================================
// NOTIFICATIONS
// ============================================

export async function getNotifications() {
  const response = await api.get('/notifications');
  return response.data;
}

export async function markNotificationAsRead(notificationId) {
  const response = await api.put(`/notifications/${notificationId}/read`);
  return response.data;
}

export async function markAllNotificationsAsRead() {
  const response = await api.put('/notifications/read-all');
  return response.data;
}

export async function deleteNotification(notificationId) {
  await api.delete(`/notifications/${notificationId}`);
  return true;
}

// ============================================
// ADMIN
// ============================================

export async function getDashboardStats() {
  const response = await api.get('/admin/stats/dashboard');
  return response.data;
}

export async function getSalesStats(period = 'today') {
  const response = await api.get('/admin/stats/sales', { params: { period } });
  return response.data;
}

export async function getProductStats() {
  const response = await api.get('/admin/stats/products');
  return response.data;
}

export async function getOrderStats() {
  const response = await api.get('/admin/stats/orders');
  return response.data;
}

export async function getUserStats() {
  const response = await api.get('/admin/stats/users');
  return response.data;
}

export async function getFinanceStats(period = '7d') {
  const response = await api.get('/admin/stats/finances', { params: { period } });
  return response.data;
}

export async function getSalesReport(format = 'pdf') {
  const response = await api.get('/admin/reports/sales', {
    params: { format },
    responseType: format === 'csv' ? 'blob' : 'blob',
  });
  return response.data;
}

export async function getProductReport(format = 'pdf') {
  const response = await api.get('/admin/reports/products', {
    params: { format },
    responseType: format === 'csv' ? 'blob' : 'blob',
  });
  return response.data;
}

// ============================================
// STAFF
// ============================================

export async function getStaff() {
  const response = await api.get('/admin/staff');
  return response.data;
}

export async function createStaff(staffData) {
  const response = await api.post('/admin/staff', staffData);
  return response.data;
}

export async function updateStaff(id, staffData) {
  const response = await api.put(`/admin/staff/${id}`, staffData);
  return response.data;
}

export async function deleteStaff(id) {
  await api.delete(`/admin/staff/${id}`);
  return true;
}

// Export default for backward compatibility
export default {
  fetchProducts,
  fetchPopular,
  fetchOrders,
  createOrder,
  fetchOrderById,
  fetchFavorites,
  toggleFavorite,
  submitReview,
  fetchReviews,
  updateOrderStatus,
  fetchProductsByIds,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
};
