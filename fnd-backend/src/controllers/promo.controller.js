const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  getPromoCodes: async (req, res) => {
    try {
      const promoCodes = await prisma.promoCode.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(promoCodes);
    } catch (error) {
      console.error('Get promo codes error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des codes promo' });
    }
  },

  createPromoCode: async (req, res) => {
    try {
      const { code, type, value, minAmount, maxDiscount, validFrom, validUntil, usageLimit, active } = req.body;

      // Validate required fields
      if (!code || !type || !value || !validFrom || !validUntil) {
        return res.status(400).json({ error: 'Champs requis manquants' });
      }

      // Check if code already exists
      const existingCode = await prisma.promoCode.findUnique({
        where: { code }
      });

      if (existingCode) {
        return res.status(400).json({ error: 'Ce code promo existe déjà' });
      }

      const promoCode = await prisma.promoCode.create({
        data: {
          code: code.toUpperCase(),
          type,
          value: parseFloat(value),
          minAmount: minAmount ? parseFloat(minAmount) : null,
          maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
          validFrom: new Date(validFrom),
          validUntil: new Date(validUntil),
          usageLimit: usageLimit ? parseInt(usageLimit) : null,
          active: active !== undefined ? active : true
        }
      });

      res.status(201).json(promoCode);
    } catch (error) {
      console.error('Create promo code error:', error);
      res.status(500).json({ error: 'Erreur lors de la création du code promo' });
    }
  },

  validatePromoCode: async (req, res) => {
    try {
      const { code, orderTotal } = req.body;

      if (!code) {
        return res.status(400).json({ error: 'Code promo requis' });
      }

      const promoCode = await prisma.promoCode.findUnique({
        where: { code: code.toUpperCase() }
      });

      if (!promoCode) {
        return res.status(404).json({ error: 'Code promo invalide' });
      }

      // Check if active
      if (!promoCode.active) {
        return res.status(400).json({ error: 'Code promo inactif' });
      }

      // Check validity dates
      const now = new Date();
      if (now < promoCode.validFrom || now > promoCode.validUntil) {
        return res.status(400).json({ error: 'Code promo expiré ou pas encore valide' });
      }

      // Check usage limit
      if (promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit) {
        return res.status(400).json({ error: 'Limite d\'utilisation atteinte' });
      }

      // Check minimum order amount
      if (promoCode.minAmount && orderTotal < promoCode.minAmount) {
        return res.status(400).json({
          error: `Montant minimum de commande: ${promoCode.minAmount} DH`
        });
      }

      // Calculate discount
      let discount = 0;
      if (promoCode.type === 'PERCENTAGE') {
        discount = (orderTotal * promoCode.value) / 100;
        if (promoCode.maxDiscount && discount > promoCode.maxDiscount) {
          discount = promoCode.maxDiscount;
        }
      } else if (promoCode.type === 'FIXED') {
        discount = promoCode.value;
      }

      res.json({
        code: promoCode.code,
        type: promoCode.type,
        value: promoCode.value,
        discount: Math.min(discount, orderTotal), // Don't exceed order total
        minAmount: promoCode.minAmount,
        validUntil: promoCode.validUntil
      });
    } catch (error) {
      console.error('Validate promo code error:', error);
      res.status(500).json({ error: 'Erreur lors de la validation du code promo' });
    }
  },

  updatePromoCode: async (req, res) => {
    try {
      const { code } = req.params;
      const { type, value, minAmount, maxDiscount, validFrom, validUntil, usageLimit, active } = req.body;

      const promoCode = await prisma.promoCode.update({
        where: { code },
        data: {
          type,
          value: parseFloat(value),
          minAmount: minAmount ? parseFloat(minAmount) : null,
          maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
          validFrom: new Date(validFrom),
          validUntil: new Date(validUntil),
          usageLimit: usageLimit ? parseInt(usageLimit) : null,
          active
        }
      });

      res.json(promoCode);
    } catch (error) {
      console.error('Update promo code error:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du code promo' });
    }
  },

  deletePromoCode: async (req, res) => {
    try {
      const { code } = req.params;

      await prisma.promoCode.delete({
        where: { code }
      });

      res.json({ message: 'Code promo supprimé avec succès' });
    } catch (error) {
      console.error('Delete promo code error:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression du code promo' });
    }
  },
};

