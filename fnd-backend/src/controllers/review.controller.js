const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  createReview: async (req, res) => {
    try {
      const userId = req.user.id;
      const { orderId, productId, rating, comment } = req.body;

      // Validate required fields
      if (!orderId || !rating) {
        return res.status(400).json({ error: 'Commande et note requis' });
      }

      // Check if rating is valid (1-5)
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'La note doit être entre 1 et 5' });
      }

      // Check if order exists and belongs to user
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          userId,
          status: 'DELIVERED' // Only allow reviews for delivered orders
        }
      });

      if (!order) {
        return res.status(404).json({ error: 'Commande non trouvée ou pas encore livrée' });
      }

      // Check if review already exists for this order
      const existingReview = await prisma.review.findFirst({
        where: {
          orderId,
          userId
        }
      });

      if (existingReview) {
        return res.status(400).json({ error: 'Vous avez déjà laissé un avis pour cette commande' });
      }

      // If productId is provided, check if it was in the order
      if (productId) {
        const orderItem = await prisma.orderItem.findFirst({
          where: {
            orderId,
            productId
          }
        });

        if (!orderItem) {
          return res.status(400).json({ error: 'Ce produit ne fait pas partie de votre commande' });
        }
      }

      const review = await prisma.review.create({
        data: {
          userId,
          orderId,
          productId,
          rating: parseInt(rating),
          comment
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          product: {
            select: {
              name: true
            }
          },
          order: {
            select: {
              id: true
            }
          }
        }
      });

      res.status(201).json(review);
    } catch (error) {
      console.error('Create review error:', error);
      res.status(500).json({ error: 'Erreur lors de la création de l\'avis' });
    }
  },

  getReviews: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const reviews = await prisma.review.findMany({
        take: parseInt(limit),
        skip: offset,
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          product: {
            select: {
              name: true
            }
          },
          order: {
            select: {
              id: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      const total = await prisma.review.count();

      res.json({
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get reviews error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des avis' });
    }
  },

  getProductReviews: async (req, res) => {
    try {
      const { productId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const reviews = await prisma.review.findMany({
        where: {
          productId
        },
        take: parseInt(limit),
        skip: offset,
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          order: {
            select: {
              id: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      const total = await prisma.review.count({
        where: { productId }
      });

      res.json({
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get product reviews error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des avis produit' });
    }
  },

  updateReview: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { rating, comment } = req.body;

      // Check if review exists and belongs to user
      const review = await prisma.review.findFirst({
        where: {
          id,
          userId
        }
      });

      if (!review) {
        return res.status(404).json({ error: 'Avis non trouvé' });
      }

      // Check if rating is valid
      if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).json({ error: 'La note doit être entre 1 et 5' });
      }

      const updatedReview = await prisma.review.update({
        where: { id },
        data: {
          rating: rating ? parseInt(rating) : review.rating,
          comment: comment !== undefined ? comment : review.comment,
          updatedAt: new Date()
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          product: {
            select: {
              name: true
            }
          },
          order: {
            select: {
              id: true
            }
          }
        }
      });

      res.json(updatedReview);
    } catch (error) {
      console.error('Update review error:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'avis' });
    }
  },

  deleteReview: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Check if review exists and belongs to user
      const review = await prisma.review.findFirst({
        where: {
          id,
          userId
        }
      });

      if (!review) {
        return res.status(404).json({ error: 'Avis non trouvé' });
      }

      await prisma.review.delete({
        where: { id }
      });

      res.json({ message: 'Avis supprimé avec succès' });
    } catch (error) {
      console.error('Delete review error:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'avis' });
    }
  },

  getReviewStats: async (req, res) => {
    try {
      const totalReviews = await prisma.review.count();
      const avgRating = await prisma.review.aggregate({
        _avg: {
          rating: true
        }
      });

      const ratingDistribution = await prisma.review.groupBy({
        by: ['rating'],
        _count: true
      });

      // Convert to expected format
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      ratingDistribution.forEach(item => {
        distribution[item.rating] = item._count;
      });

      res.json({
        avgRating: Math.round((avgRating._avg.rating || 0) * 10) / 10,
        totalReviews,
        ratingDistribution: distribution
      });
    } catch (error) {
      console.error('Get review stats error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
  },

  getAllReviews: async (req, res) => {
    try {
      const reviews = await prisma.review.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true
            }
          },
          product: {
            select: {
              name: true
            }
          },
          order: {
            select: {
              id: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(reviews);
    } catch (error) {
      console.error('Get all reviews error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération de tous les avis' });
    }
  },

  respondToReview: async (req, res) => {
    try {
      const { id } = req.params;
      const { adminResponse } = req.body;

      if (!adminResponse) {
        return res.status(400).json({ error: 'Réponse requise' });
      }

      const review = await prisma.review.update({
        where: { id },
        data: {
          adminResponse,
          updatedAt: new Date()
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          product: {
            select: {
              name: true
            }
          },
          order: {
            select: {
              id: true
            }
          }
        }
      });

      res.json(review);
    } catch (error) {
      console.error('Respond to review error:', error);
      res.status(500).json({ error: 'Erreur lors de la réponse à l\'avis' });
    }
  },
};

