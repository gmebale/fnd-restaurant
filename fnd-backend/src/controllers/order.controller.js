// Stub - À implémenter complètement
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  createOrder: async (req, res) => {
    try {
      const userId = req.user?.id; // Optional for guest orders
      const { phone, address, notes, items, promoCode, usePoints } = req.body;

      // Validate required fields
      if (!phone || !address) {
        return res.status(400).json({ error: 'Phone and address are required' });
      }

      let cartItems = [];

      if (userId) {
        // Authenticated user: get cart from database
        const cart = await prisma.cart.findUnique({
          where: { userId },
          include: {
            items: {
              include: { product: true }
            }
          }
        });

        if (!cart || cart.items.length === 0) {
          return res.status(400).json({ error: 'Cart is empty' });
        }

        cartItems = cart.items;
      } else {
        // Guest user: items should be provided in request body
        if (!items || items.length === 0) {
          return res.status(400).json({ error: 'Cart is empty' });
        }

        // Fetch product details for guest cart items
        const productIds = items.map(item => item.productId);
        const products = await prisma.product.findMany({
          where: { id: { in: productIds } }
        });

        // Create cart items structure for guest
        cartItems = items.map(item => {
          const product = products.find(p => p.id === item.productId);
          if (!product) {
            throw new Error(`Product ${item.productId} not found`);
          }
          return {
            product,
            quantity: item.quantity
          };
        });
      }

      // Validate cart items availability
      const invalidItems = [];
      let subtotal = 0;

      for (const item of cartItems) {
        if (!item.product.available) {
          invalidItems.push({
            productId: item.product.id,
            productName: item.product.name,
            reason: 'Product not available'
          });
        } else {
          subtotal += item.product.price * item.quantity;
        }
      }

      if (invalidItems.length > 0) {
        return res.status(400).json({
          error: 'Some items are not available',
          invalidItems
        });
      }

      // Calculate totals
      const deliveryFee = 15; // Fixed delivery fee
      let discount = 0;

      // TODO: Implement promo code validation
      // TODO: Implement loyalty points redemption

      const total = subtotal + deliveryFee - discount;

      // Create order in database
      const order = await prisma.order.create({
        data: {
          userId, // Can be null for guest orders
          phone,
          address,
          status: 'PENDING',
          subtotal,
          deliveryFee,
          discount,
          promoCode,
          total,
          notes,
          paymentMethod: 'CASH', // Default payment method
          paymentStatus: 'PENDING'
        }
      });

      // Award loyalty points if user is authenticated
      if (userId) {
        const pointsEarned = Math.floor(subtotal); // 1 point per DH spent

        if (pointsEarned > 0) {
          // Get or create loyalty points record
          let loyaltyPoints = await prisma.loyaltyPoints.findUnique({
            where: { userId }
          });

          if (!loyaltyPoints) {
            loyaltyPoints = await prisma.loyaltyPoints.create({
              data: {
                userId,
                points: 0,
                totalEarned: 0,
                totalSpent: 0
              }
            });
          }

          // Update loyalty points
          await prisma.loyaltyPoints.update({
            where: { userId },
            data: {
              points: loyaltyPoints.points + pointsEarned,
              totalEarned: loyaltyPoints.totalEarned + pointsEarned
            }
          });

          // Create loyalty transaction
          await prisma.loyaltyTransaction.create({
            data: {
              userId,
              loyaltyPointsId: loyaltyPoints.id,
              orderId: order.id,
              type: 'EARNED',
              points: pointsEarned,
              description: `Points gagnés pour la commande #${order.id.slice(-8)}`
            }
          });
        }
      }

      // Create order items
      const orderItems = [];
      for (const cartItem of cartItems) {
        const orderItem = await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: cartItem.product.id,
            productName: cartItem.product.name, // Snapshot
            productPrice: cartItem.product.price, // Snapshot
            quantity: cartItem.quantity,
            subtotal: cartItem.product.price * cartItem.quantity
          }
        });
        orderItems.push(orderItem);
      }

      // Clear user's cart if authenticated
      if (userId) {
        const cart = await prisma.cart.findUnique({
          where: { userId }
        });
        if (cart) {
          await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
          });
        }
      }

      // Return created order with items
      const createdOrder = await prisma.order.findUnique({
        where: { id: order.id },
        include: {
          items: true
        }
      });

      res.status(201).json(createdOrder);
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  },
  getOrders: async (req, res) => {
    try {
      const userId = req.user.id;
      const userPhone = req.user.phone;

      const orders = await prisma.order.findMany({
        where: {
          OR: [
            { userId },
            { phone: userPhone }
          ]
        },
        include: {
          items: true,
          review: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(orders);
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  },
  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userPhone = req.user.phone;

      const order = await prisma.order.findFirst({
        where: {
          id,
          OR: [
            { userId },
            { phone: userPhone }
          ]
        },
        include: {
          items: true,
          review: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });

      if (!order) {
        return res.status(404).json({ error: 'Commande non trouvée' });
      }

      res.json(order);
    } catch (error) {
      console.error('Get order by ID error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération de la commande' });
    }
  },
  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate status
      const validStatuses = ['PENDING', 'PREPARING', 'READY', 'DELIVERING', 'DELIVERED', 'CANCELLED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Statut invalide' });
      }

      // Check if order exists
      const order = await prisma.order.findUnique({
        where: { id }
      });

      if (!order) {
        return res.status(404).json({ error: 'Commande non trouvée' });
      }

      // Update order status
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          status,
          ...(status === 'DELIVERED' && { deliveredAt: new Date() })
        },
        include: {
          items: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });

      res.json(updatedOrder);
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du statut de la commande' });
    }
  },
  cancelOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Check if order exists and belongs to user
      const order = await prisma.order.findFirst({
        where: {
          id,
          userId
        }
      });

      if (!order) {
        return res.status(404).json({ error: 'Commande non trouvée' });
      }

      // Only allow cancellation if order is still pending
      if (order.status !== 'PENDING') {
        return res.status(400).json({ error: 'Impossible d\'annuler une commande déjà en préparation' });
      }

      // Update order status to cancelled
      const cancelledOrder = await prisma.order.update({
        where: { id },
        data: {
          status: 'CANCELLED'
        },
        include: {
          items: true
        }
      });

      res.json(cancelledOrder);
    } catch (error) {
      console.error('Cancel order error:', error);
      res.status(500).json({ error: 'Erreur lors de l\'annulation de la commande' });
    }
  },
  getOrderStats: async (req, res) => {
    try {
      const totalOrders = await prisma.order.count();
      const pendingOrders = await prisma.order.count({
        where: { status: 'PENDING' }
      });
      const completedOrders = await prisma.order.count({
        where: { status: 'DELIVERED' }
      });
      const cancelledOrders = await prisma.order.count({
        where: { status: 'CANCELLED' }
      });

      // Orders by status
      const ordersByStatus = await prisma.order.groupBy({
        by: ['status'],
        _count: true
      });

      // Today's orders
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayOrders = await prisma.order.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      });

      // Today's revenue
      const todayRevenue = await prisma.order.aggregate({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow
          },
          status: {
            not: 'CANCELLED'
          }
        },
        _sum: {
          total: true
        }
      });

      res.json({
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        ordersByStatus,
        todayOrders,
        todayRevenue: todayRevenue._sum.total || 0
      });
    } catch (error) {
      console.error('Error fetching order stats:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des statistiques de commandes' });
    }
  },
  getPendingOrders: async (req, res) => {
    try {
      const orders = await prisma.order.findMany({
        where: {
          status: 'PENDING'
        },
        include: {
          items: true,
          user: {
            select: {
              name: true,
              email: true,
              phone: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      res.json(orders);
    } catch (error) {
      console.error('Get pending orders error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des commandes en attente' });
    }
  },
  getReadyOrders: async (req, res) => res.status(501).json({ message: 'Not implemented' }),

  getAllOrders: async (req, res) => {
    try {
      const orders = await prisma.order.findMany({
        include: {
          items: true,
          user: {
            select: {
              name: true,
              email: true,
              phone: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(orders);
    } catch (error) {
      console.error('Get all orders error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération de toutes les commandes' });
    }
  },
};

