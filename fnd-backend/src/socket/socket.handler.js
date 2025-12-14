const { authenticateSocket } = require('../middleware/socketAuth.middleware');
const prisma = require('../config/database');
const logger = require('../utils/logger');

/**
 * Socket.IO connection handler
 */
const socketHandler = (socket, io) => {
  logger.info(`Socket connected: ${socket.id}`);

  // Authenticate socket connection
  socket.on('authenticate', async (token) => {
    try {
      const user = await authenticateSocket(token);
      socket.userId = user.id;
      socket.userRole = user.role;
      
      // Join user-specific room
      socket.join(`user:${user.id}`);
      
      // Join role-specific rooms
      socket.join(`role:${user.role}`);
      
      socket.emit('authenticated', { userId: user.id, role: user.role });
      logger.info(`Socket authenticated: ${socket.id} - User: ${user.id}`);
    } catch (error) {
      socket.emit('error', { message: 'Authentication failed' });
      socket.disconnect();
    }
  });

  // Join order room
  socket.on('join-order', (orderId) => {
    socket.join(`order:${orderId}`);
    logger.info(`Socket ${socket.id} joined order room: ${orderId}`);
  });

  // Leave order room
  socket.on('leave-order', (orderId) => {
    socket.leave(`order:${orderId}`);
  });

  // Handle new message
  socket.on('message:send', async (data) => {
    try {
      const { orderId, content } = data;
      
      if (!socket.userId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      // Create message in database
      const message = await prisma.message.create({
        data: {
          orderId,
          userId: socket.userId,
          content,
          type: 'TEXT',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      });

      // Emit to order room
      io.to(`order:${orderId}`).emit('message:new', message);
      
      // Notify users in order room
      io.to(`order:${orderId}`).emit('notification', {
        type: 'MESSAGE',
        title: 'Nouveau message',
        message: `Message reçu pour la commande ${orderId}`,
        orderId,
      });
    } catch (error) {
      logger.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle order status update
  socket.on('order:status-update', async (data) => {
    try {
      const { orderId, status } = data;
      
      if (!socket.userId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      // Check permissions (admin, cuisinier, livreur)
      const userRole = socket.userRole;
      if (!['ADMIN', 'CUISINIER', 'LIVREUR', 'SUPER_ADMIN'].includes(userRole)) {
        socket.emit('error', { message: 'Insufficient permissions' });
        return;
      }

      // Update order status
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status },
      });

      // Emit to order room
      io.to(`order:${orderId}`).emit('order:status-changed', {
        orderId,
        status,
        updatedAt: order.updatedAt,
      });

      // Notify order owner
      io.to(`user:${order.userId}`).emit('notification', {
        type: 'ORDER',
        title: 'Statut de commande mis à jour',
        message: `Votre commande ${orderId} est maintenant ${status}`,
        orderId,
      });
    } catch (error) {
      logger.error('Error updating order status:', error);
      socket.emit('error', { message: 'Failed to update order status' });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
};

module.exports = socketHandler;

