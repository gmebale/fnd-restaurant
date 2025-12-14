const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  getFavorites: async (req, res) => {
    try {
      const userId = req.user.id;

      const favorites = await prisma.favorite.findMany({
        where: { userId },
        include: {
          product: true
        }
      });

      res.json(favorites);
    } catch (error) {
      console.error('Get favorites error:', error);
      res.status(500).json({ error: 'Failed to get favorites' });
    }
  },

  addFavorite: async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId } = req.params;

      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Check if already favorite
      const existing = await prisma.favorite.findUnique({
        where: {
          userId_productId: {
            userId,
            productId
          }
        }
      });

      if (existing) {
        return res.status(409).json({ error: 'Product already in favorites' });
      }

      const favorite = await prisma.favorite.create({
        data: {
          userId,
          productId
        },
        include: {
          product: true
        }
      });

      res.status(201).json(favorite);
    } catch (error) {
      console.error('Add favorite error:', error);
      res.status(500).json({ error: 'Failed to add favorite' });
    }
  },

  removeFavorite: async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId } = req.params;

      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_productId: {
            userId,
            productId
          }
        }
      });

      if (!favorite) {
        return res.status(404).json({ error: 'Favorite not found' });
      }

      await prisma.favorite.delete({
        where: {
          userId_productId: {
            userId,
            productId
          }
        }
      });

      res.json({ message: 'Favorite removed' });
    } catch (error) {
      console.error('Remove favorite error:', error);
      res.status(500).json({ error: 'Failed to remove favorite' });
    }
  }
};

