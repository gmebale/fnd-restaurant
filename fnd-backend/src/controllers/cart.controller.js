const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  getCart: async (req, res) => {
    try {
      const userId = req.user.id;

      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      if (!cart) {
        return res.json({ items: [] });
      }

      res.json(cart);
    } catch (error) {
      console.error('Get cart error:', error);
      res.status(500).json({ error: 'Failed to get cart' });
    }
  },

  addItem: async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId, quantity = 1 } = req.body;

      // Check if product exists and is available
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!product || !product.available) {
        return res.status(400).json({ error: 'Product not available' });
      }

      // Get or create cart
      let cart = await prisma.cart.findUnique({
        where: { userId }
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId }
        });
      }

      // Check if item already exists
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId
          }
        }
      });

      if (existingItem) {
        // Update quantity
        const updatedItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
          include: { product: true }
        });
        return res.json(updatedItem);
      } else {
        // Create new item
        const newItem = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity
          },
          include: { product: true }
        });
        return res.json(newItem);
      }
    } catch (error) {
      console.error('Add item error:', error);
      res.status(500).json({ error: 'Failed to add item' });
    }
  },

  updateItem: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { quantity } = req.body;

      // Verify item belongs to user
      const item = await prisma.cartItem.findFirst({
        where: {
          id,
          cart: { userId }
        }
      });

      if (!item) {
        return res.status(404).json({ error: 'Cart item not found' });
      }

      if (quantity <= 0) {
        await prisma.cartItem.delete({ where: { id } });
        return res.json({ message: 'Item removed' });
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id },
        data: { quantity },
        include: { product: true }
      });

      res.json(updatedItem);
    } catch (error) {
      console.error('Update item error:', error);
      res.status(500).json({ error: 'Failed to update item' });
    }
  },

  removeItem: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Verify item belongs to user
      const item = await prisma.cartItem.findFirst({
        where: {
          id,
          cart: { userId }
        }
      });

      if (!item) {
        return res.status(404).json({ error: 'Cart item not found' });
      }

      await prisma.cartItem.delete({ where: { id } });
      res.json({ message: 'Item removed' });
    } catch (error) {
      console.error('Remove item error:', error);
      res.status(500).json({ error: 'Failed to remove item' });
    }
  },

  clearCart: async (req, res) => {
    try {
      const userId = req.user.id;

      const cart = await prisma.cart.findUnique({
        where: { userId }
      });

      if (cart) {
        await prisma.cartItem.deleteMany({
          where: { cartId: cart.id }
        });
      }

      res.json({ message: 'Cart cleared' });
    } catch (error) {
      console.error('Clear cart error:', error);
      res.status(500).json({ error: 'Failed to clear cart' });
    }
  },

  validateCart: async (req, res) => {
    try {
      const userId = req.user.id;

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

      const invalidItems = [];
      let total = 0;

      for (const item of cart.items) {
        if (!item.product.available) {
          invalidItems.push({
            id: item.id,
            productName: item.product.name,
            reason: 'Product not available'
          });
        } else {
          total += item.product.price * item.quantity;
        }
      }

      if (invalidItems.length > 0) {
        return res.status(400).json({
          error: 'Some items are not available',
          invalidItems,
          validTotal: total
        });
      }

      res.json({
        valid: true,
        total,
        itemCount: cart.items.length
      });
    } catch (error) {
      console.error('Validate cart error:', error);
      res.status(500).json({ error: 'Failed to validate cart' });
    }
  }
};

