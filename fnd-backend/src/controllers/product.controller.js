const prisma = require('../config/database');

module.exports = {
  getAllProducts: async (req, res) => {
    try {
      const { category } = req.query;

      const where = {
        available: true,
        ...(category && category !== 'Tous' && { category })
      };

      const products = await prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          price: true,
          image: true,
          available: true,
          popular: true,
          createdAt: true
        },
        orderBy: [
          { popular: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
    }
  },
  getProductById: async (req, res) => res.status(501).json({ message: 'Not implemented' }),
  getPopularProducts: async (req, res) => {
    try {
      const products = await prisma.product.findMany({
        where: {
          popular: true,
          available: true
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          image: true,
          popular: true
        },

        orderBy: { createdAt: 'desc' },
        take: 10 // Limit to 10 popular products
      });

      res.json(products);
    } catch (error) {
      console.error('Error fetching popular products:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des produits populaires' });
    }
  },
  getCategories: async (req, res) => {
    try {
      const categories = await prisma.product.findMany({
        select: {
          category: true
        },
        distinct: ['category'],
        orderBy: {
          category: 'asc'
        }
      });

      const categoryList = categories.map(c => c.category);
      res.json(categoryList);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
    }
  },
  createProduct: async (req, res) => {
    try {
      const { name, description, category, price, image, available, popular } = req.body;

      if (!name || !description || !category || price === undefined) {
        return res.status(400).json({ error: 'Nom, description, catégorie et prix sont requis' });
      }

      const product = await prisma.product.create({
        data: {
          name,
          description,
          category,
          price: parseFloat(price),
          image: image || '/images/placeholder.jpg',
          available: available !== undefined ? available : true,
          popular: popular || false
        },
        include: {
          productImages: true,
          _count: {
            select: { favorites: true, reviews: true }
          }
        }
      });

      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Erreur lors de la création du produit' });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, category, price, image, available, popular } = req.body;

      const existingProduct = await prisma.product.findUnique({
        where: { id }
      });

      if (!existingProduct) {
        return res.status(404).json({ error: 'Produit non trouvé' });
      }

      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description && { description }),
          ...(category && { category }),
          ...(price !== undefined && { price: parseFloat(price) }),
          ...(image && { image }),
          ...(available !== undefined && { available }),
          ...(popular !== undefined && { popular })
        },
        include: {
          productImages: true,
          _count: {
            select: { favorites: true, reviews: true }
          }
        }
      });

      res.json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' });
    }
  },
  deleteProduct: async (req, res) => res.status(501).json({ message: 'Not implemented' }),
  uploadImage: async (req, res) => res.status(501).json({ message: 'Not implemented' }),
};

