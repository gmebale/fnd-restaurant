const { verifyAccessToken } = require('../config/jwt');
const prisma = require('../config/database');

/**
 * Authenticate socket connection
 */
const authenticateSocket = async (token) => {
  try {
    const decoded = verifyAccessToken(token);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = { authenticateSocket };

