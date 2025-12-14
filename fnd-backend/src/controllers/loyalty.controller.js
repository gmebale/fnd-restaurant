// Stub - À implémenter complètement
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  getPoints: async (req, res) => {
    try {
      const userId = req.user.id;

      const loyaltyData = await prisma.loyaltyPoints.findUnique({
        where: { userId },
        include: {
          transactions: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 10 // Last 10 transactions
          }
        }
      });

      // Calculate additional data from orders
      const orders = await prisma.order.findMany({
        where: { userId },
        select: { total: true }
      });

      const total_spent = orders.reduce((sum, order) => sum + order.total, 0);
      const orders_count = orders.length;
      const progress_percent = loyaltyData ? (loyaltyData.points % 100) : 0;
      const next_reward_amount_needed = 100 - progress_percent;

      if (!loyaltyData) {
        // Create loyalty points record if it doesn't exist
        const newLoyaltyData = await prisma.loyaltyPoints.create({
          data: {
            userId,
            points: 0,
            totalEarned: 0,
            totalSpent: 0
          },
          include: {
            transactions: true
          }
        });

        return res.json({
          points: newLoyaltyData.points,
          totalEarned: newLoyaltyData.totalEarned,
          totalSpent: newLoyaltyData.totalSpent,
          total_spent,
          orders_count,
          progress_percent,
          next_reward_amount_needed,
          recentTransactions: newLoyaltyData.transactions
        });
      }

      res.json({
        points: loyaltyData.points,
        totalEarned: loyaltyData.totalEarned,
        totalSpent: loyaltyData.totalSpent,
        total_spent,
        orders_count,
        progress_percent,
        next_reward_amount_needed,
        recentTransactions: loyaltyData.transactions
      });
    } catch (error) {
      console.error('Get loyalty points error:', error);
      res.status(500).json({ error: 'Failed to fetch loyalty points' });
    }
  },
  getHistory: async (req, res) => res.status(501).json({ message: 'Not implemented' }),
  redeemPoints: async (req, res) => {
    try {
      const userId = req.user.id;
      const { pointsToRedeem } = req.body;

      if (!pointsToRedeem || pointsToRedeem < 10) {
        return res.status(400).json({ error: 'Minimum 10 points required for redemption' });
      }

      const loyaltyData = await prisma.loyaltyPoints.findUnique({
        where: { userId }
      });

      if (!loyaltyData || loyaltyData.points < pointsToRedeem) {
        return res.status(400).json({ error: 'Insufficient points' });
      }

      // Calculate discount amount (10 points = 1 DH)
      const discountAmount = Math.floor(pointsToRedeem / 10);

      // Update loyalty points
      await prisma.loyaltyPoints.update({
        where: { userId },
        data: {
          points: loyaltyData.points - pointsToRedeem,
          totalSpent: loyaltyData.totalSpent + pointsToRedeem
        }
      });

      // Create loyalty transaction
      await prisma.loyaltyTransaction.create({
        data: {
          userId,
          loyaltyPointsId: loyaltyData.id,
          type: 'REDEEMED',
          points: pointsToRedeem,
          description: `Échange de ${pointsToRedeem} points pour ${discountAmount} DH de réduction`
        }
      });

      res.json({
        success: true,
        discountAmount,
        remainingPoints: loyaltyData.points - pointsToRedeem
      });
    } catch (error) {
      console.error('Redeem points error:', error);
      res.status(500).json({ error: 'Failed to redeem points' });
    }
  },
  getRules: async (req, res) => res.status(501).json({ message: 'Not implemented' }),
};

