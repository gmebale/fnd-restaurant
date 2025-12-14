const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { generateAccessToken, generateRefreshToken } = require('../config/jwt');
const logger = require('../utils/logger');

// Stub controllers - À implémenter complètement

const register = async (req, res) => {
  try {
    // TODO: Implement registration
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (error) {
    logger.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        phone: true,
        role: true,
        points: true,
        avatar: true,
        provider: true,
      },
    });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user has a password (not OAuth user)
    if (!user.password) {
      return res.status(401).json({ error: 'Please login with your OAuth provider' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      role: user.role,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    logger.info(`User ${user.email} logged in successfully`);

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

const refreshToken = async (req, res) => {
  try {
    // TODO: Implement refresh token
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
};

const googleAuth = async (req, res) => {
  try {
    // TODO: Implement Google OAuth
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (error) {
    logger.error('Google auth error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
};

const googleCallback = async (req, res) => {
  try {
    // TODO: Implement Google callback
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (error) {
    logger.error('Google callback error:', error);
    res.status(500).json({ error: 'Google callback failed' });
  }
};

const appleAuth = async (req, res) => {
  try {
    // TODO: Implement Apple OAuth
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (error) {
    logger.error('Apple auth error:', error);
    res.status(500).json({ error: 'Apple authentication failed' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        points: true,
        avatar: true,
        createdAt: true,
      },
    });
    res.json(user);
  } catch (error) {
    logger.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

const changePassword = async (req, res) => {
  try {
    // TODO: Implement change password
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({ error: 'Password change failed' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    // TODO: Implement forgot password
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({ error: 'Forgot password failed' });
  }
};

const resetPassword = async (req, res) => {
  try {
    // TODO: Implement reset password
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
};

const logout = async (req, res) => {
  try {
    // TODO: Implement logout (invalidate refresh token)
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const userId = req.user.id;

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        points: true,
        avatar: true,
        createdAt: true,
      },
    });

    logger.info(`User ${req.user.id} updated profile successfully`);

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  googleAuth,
  googleCallback,
  appleAuth,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
  logout,
  updateProfile,
};

