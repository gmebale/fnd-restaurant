const prisma = require('../config/database');

module.exports = {
  getDashboardStats: async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Today's orders
      const todayOrders = await prisma.order.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      });

      // Pending orders
      const pendingOrders = await prisma.order.count({
        where: { status: 'PENDING' }
      });

      // Preparing orders
      const preparingOrders = await prisma.order.count({
        where: { status: 'PREPARING' }
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
        todayOrders,
        pendingOrders,
        preparingOrders,
        todayRevenue: todayRevenue._sum.total || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des statistiques du tableau de bord' });
    }
  },

  getSalesStats: async (req, res) => {
    try {
      const { period = 'today' } = req.query;
      let startDate, endDate;

      const now = new Date();

      switch (period) {
        case 'today':
          startDate = new Date(now);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 1);
          break;
        case 'week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(now);
          break;
        case 'month':
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(now);
          break;
        default:
          startDate = new Date(now);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 1);
      }

      const sales = await prisma.order.aggregate({
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate
          },
          status: {
            not: 'CANCELLED'
          }
        },
        _sum: {
          total: true,
          subtotal: true,
          deliveryFee: true
        },
        _count: true
      });

      res.json({
        period,
        totalSales: sales._sum.total || 0,
        subtotal: sales._sum.subtotal || 0,
        deliveryFees: sales._sum.deliveryFee || 0,
        orderCount: sales._count,
        averageOrderValue: sales._count > 0 ? (sales._sum.total || 0) / sales._count : 0
      });
    } catch (error) {
      console.error('Error fetching sales stats:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des statistiques de ventes' });
    }
  },

  getProductStats: async (req, res) => {
    try {
      const totalProducts = await prisma.product.count();
      const availableProducts = await prisma.product.count({
        where: { available: true }
      });
      const popularProducts = await prisma.product.count({
        where: { popular: true }
      });

      // Top selling products
      const topProducts = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true
        },
        orderBy: {
          _sum: {
            quantity: 'desc'
          }
        },
        take: 10
      });

      // Get product details for top products
      const topProductDetails = await Promise.all(
        topProducts.map(async (item) => {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
            select: { id: true, name: true, category: true }
          });
          return {
            ...product,
            totalSold: item._sum.quantity
          };
        })
      );

      res.json({
        totalProducts,
        availableProducts,
        popularProducts,
        topProducts: topProductDetails
      });
    } catch (error) {
      console.error('Error fetching product stats:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des statistiques de produits' });
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

      res.json({
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        ordersByStatus
      });
    } catch (error) {
      console.error('Error fetching order stats:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des statistiques de commandes' });
    }
  },

  getUserStats: async (req, res) => {
    try {
      const totalUsers = await prisma.user.count();
      const activeUsers = await prisma.user.count({
        where: {
          orders: {
            some: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
              }
            }
          }
        }
      });

      // Users by role
      const usersByRole = await prisma.user.groupBy({
        by: ['role'],
        _count: true
      });

      res.json({
        totalUsers,
        activeUsers,
        usersByRole
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des statistiques d\'utilisateurs' });
    }
  },

  getSalesReport: async (req, res) => {
    try {
      const { format = 'json' } = req.query;

      // Get sales data for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const salesData = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          },
          status: {
            not: 'CANCELLED'
          }
        },
        select: {
          id: true,
          total: true,
          createdAt: true,
          status: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (format === 'json') {
        res.json({
          reportType: 'sales',
          generatedAt: new Date(),
          period: 'last_30_days',
          data: salesData
        });
      } else {
        // For PDF/CSV, we'd need additional libraries
        // For now, return JSON
        res.json({
          reportType: 'sales',
          generatedAt: new Date(),
          period: 'last_30_days',
          data: salesData,
          note: 'PDF/CSV export not yet implemented'
        });
      }
    } catch (error) {
      console.error('Error generating sales report:', error);
      res.status(500).json({ error: 'Erreur lors de la génération du rapport de ventes' });
    }
  },

  getProductReport: async (req, res) => {
    try {
      const { format = 'json' } = req.query;

      const products = await prisma.product.findMany({
        include: {
          _count: {
            select: {
              orderItems: true,
              favorites: true,
              reviews: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Calculate total sales for each product
      const productsWithSales = await Promise.all(
        products.map(async (product) => {
          const totalSold = await prisma.orderItem.aggregate({
            where: { productId: product.id },
            _sum: { quantity: true }
          });

          const totalRevenue = await prisma.orderItem.aggregate({
            where: { productId: product.id },
            _sum: { subtotal: true }
          });

          return {
            ...product,
            totalSold: totalSold._sum.quantity || 0,
            totalRevenue: totalRevenue._sum.subtotal || 0
          };
        })
      );

      if (format === 'json') {
        res.json({
          reportType: 'products',
          generatedAt: new Date(),
          data: productsWithSales
        });
      } else {
        // For PDF/CSV, we'd need additional libraries
        res.json({
          reportType: 'products',
          generatedAt: new Date(),
          data: productsWithSales,
          note: 'PDF/CSV export not yet implemented'
        });
      }
    } catch (error) {
      console.error('Error generating product report:', error);
      res.status(500).json({ error: 'Erreur lors de la génération du rapport de produits' });
    }
  },

  // Staff management functions
  getStaff: async (req, res) => {
    try {
      const staff = await prisma.user.findMany({
        where: {
          role: {
            in: ['CUISINIER', 'LIVREUR', 'ADMIN', 'SUPER_ADMIN']
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          hireDate: true,
          salary: true,
          status: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(staff);
    } catch (error) {
      console.error('Error fetching staff:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération du personnel' });
    }
  },

  createStaff: async (req, res) => {
    try {
      const { name, email, phone, role, hireDate, salary, status, password } = req.body;

      // Hash password if provided
      let hashedPassword = null;
      if (password) {
        const bcrypt = require('bcrypt');
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const staff = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          role,
          hireDate: hireDate ? new Date(hireDate) : null,
          salary: salary ? parseFloat(salary) : null,
          status: status || 'active',
          password: hashedPassword
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          hireDate: true,
          salary: true,
          status: true,
          createdAt: true
        }
      });

      res.status(201).json(staff);
    } catch (error) {
      console.error('Error creating staff:', error);
      if (error.code === 'P2002') {
        res.status(400).json({ error: 'Un employé avec cet email existe déjà' });
      } else {
        res.status(500).json({ error: 'Erreur lors de la création de l\'employé' });
      }
    }
  },

  updateStaff: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone, role, hireDate, salary, status, password } = req.body;

      // Prepare update data
      const updateData = {
        name,
        email,
        phone,
        role,
        hireDate: hireDate ? new Date(hireDate) : null,
        salary: salary ? parseFloat(salary) : null,
        status
      };

      // Hash password if provided
      if (password) {
        const bcrypt = require('bcrypt');
        updateData.password = await bcrypt.hash(password, 10);
      }

      const staff = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          hireDate: true,
          salary: true,
          status: true,
          createdAt: true
        }
      });

      res.json(staff);
    } catch (error) {
      console.error('Error updating staff:', error);
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Employé non trouvé' });
      } else if (error.code === 'P2002') {
        res.status(400).json({ error: 'Un employé avec cet email existe déjà' });
      } else {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'employé' });
      }
    }
  },

  deleteStaff: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.user.delete({
        where: { id }
      });

      res.json({ message: 'Employé supprimé avec succès' });
    } catch (error) {
      console.error('Error deleting staff:', error);
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Employé non trouvé' });
      } else {
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'employé' });
      }
    }
  },

  getFinanceStats: async (req, res) => {
    try {
      const { period = '7d' } = req.query;

      // Calculate date range based on period
      let startDate, endDate;
      const now = new Date();

      switch (period) {
        case '7d':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(now);
          break;
        case '30d':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 30);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(now);
          break;
        case '90d':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 90);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(now);
          break;
        case '1y':
          startDate = new Date(now);
          startDate.setFullYear(now.getFullYear() - 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(now);
          break;
        default:
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(now);
      }

      // Total revenue and orders for the period
      const periodStats = await prisma.order.aggregate({
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate
          },
          status: {
            not: 'CANCELLED'
          }
        },
        _sum: {
          total: true
        },
        _count: true
      });

      const totalRevenue = periodStats._sum.total || 0;
      const totalOrders = periodStats._count;

      // Average order value
      const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

      // Cancellation rate
      const totalOrdersAll = await prisma.order.count({
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate
          }
        }
      });

      const cancelledOrders = await prisma.order.count({
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate
          },
          status: 'CANCELLED'
        }
      });

      const cancellationRate = totalOrdersAll > 0 ? Math.round((cancelledOrders / totalOrdersAll) * 100 * 10) / 10 : 0;

      // Conversion rate (using a simple approximation - orders vs total users)
      const totalUsers = await prisma.user.count();
      const conversionRate = totalUsers > 0 ? Math.round((totalOrders / totalUsers) * 100 * 10) / 10 : 0;

      // Revenue data for the last 7 days (for chart)
      const revenueData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const dayRevenue = await prisma.order.aggregate({
          where: {
            createdAt: {
              gte: dayStart,
              lt: dayEnd
            },
            status: {
              not: 'CANCELLED'
            }
          },
          _sum: {
            total: true
          }
        });

        const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
        revenueData.push({
          day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
          revenue: dayRevenue._sum.total || 0
        });
      }

      // Category data (revenue by category)
      const categoryStats = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
          subtotal: true
        },
        where: {
          order: {
            createdAt: {
              gte: startDate,
              lt: endDate
            },
            status: {
              not: 'CANCELLED'
            }
          }
        }
      });

      // Get product details with categories
      const categoryMap = {};
      for (const stat of categoryStats) {
        const product = await prisma.product.findUnique({
          where: { id: stat.productId },
          select: { category: true }
        });

        if (product && product.category) {
          const category = product.category;
          if (!categoryMap[category]) {
            categoryMap[category] = 0;
          }
          categoryMap[category] += stat._sum.subtotal || 0;
        }
      }

      const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
        name,
        value: Math.round(value),
        color: getCategoryColor(name)
      }));

      // Top products
      const topProductsData = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true,
          subtotal: true
        },
        _count: true,
        orderBy: {
          _sum: {
            subtotal: 'desc'
          }
        },
        take: 5,
        where: {
          order: {
            createdAt: {
              gte: startDate,
              lt: endDate
            },
            status: {
              not: 'CANCELLED'
            }
          }
        }
      });

      const topProducts = [];
      for (const product of topProductsData) {
        const productDetails = await prisma.product.findUnique({
          where: { id: product.productId },
          select: { name: true }
        });

        if (productDetails) {
          topProducts.push({
            name: productDetails.name,
            orders: product._count,
            revenue: Math.round(product._sum.subtotal || 0)
          });
        }
      }

      // Top clients
      const topClientsData = await prisma.order.groupBy({
        by: ['userId'],
        _sum: {
          total: true
        },
        _count: true,
        orderBy: {
          _sum: {
            total: 'desc'
          }
        },
        take: 5,
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate
          },
          status: {
            not: 'CANCELLED'
          },
          userId: {
            not: null
          }
        }
      });

      const topClients = [];
      for (const client of topClientsData) {
        const userDetails = await prisma.user.findUnique({
          where: { id: client.userId },
          select: { name: true }
        });

        if (userDetails) {
          topClients.push({
            name: userDetails.name,
            orders: client._count,
            total: Math.round(client._sum.total || 0)
          });
        }
      }

      res.json({
        totalRevenue,
        avgOrderValue,
        totalOrders,
        cancellationRate,
        conversionRate,
        revenueData,
        categoryData,
        topProducts,
        topClients
      });
    } catch (error) {
      console.error('Error fetching finance stats:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des statistiques financières' });
    }
  }
};

// Helper function to get category colors
function getCategoryColor(category) {
  const colors = {
    'Burgers': '#fc0000',
    'Pizzas': '#FFB703',
    'Salades': '#10B981',
    'Desserts': '#8B5CF6',
    'Boissons': '#06B6D4'
  };
  return colors[category] || '#8884d8';
}

