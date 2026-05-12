const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
} = require('../utils/tokenUtils');
const { AppError } = require('../middleware/errorHandler');
const axios = require('axios');
const { META_API_BASE } = require('../config/constants');
const logger = require('../config/logger');

class AuthService {
  async register({ email, password, name }) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError('Email already registered.', 409);
    }

    const user = await User.create({
      email,
      passwordHash: password,
      name,
    });

    const tokens = await this.generateTokenPair(user);
    return { user, ...tokens };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email }).select('+passwordHash +refreshTokens');
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated.', 403);
    }

    user.lastLoginAt = new Date();
    await user.save();

    const tokens = await this.generateTokenPair(user);
    return { user, ...tokens };
  }

  async refreshAccessToken(refreshToken) {
    const user = await User.findOne({
      'refreshTokens.token': refreshToken,
      'refreshTokens.expiresAt': { $gt: new Date() },
    });

    if (!user) {
      throw new AppError('Invalid or expired refresh token.', 401);
    }

    // Rotate: remove old, create new
    user.refreshTokens = user.refreshTokens.filter(
      (rt) => rt.token !== refreshToken
    );

    const tokens = await this.generateTokenPair(user);
    return tokens;
  }

  async logout(userId, refreshToken) {
    await User.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: { token: refreshToken } },
    });
  }

  async generateTokenPair(user) {
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken();
    const expiresAt = getRefreshTokenExpiry();

    user.refreshTokens.push({ token: refreshToken, expiresAt });
    // Keep only the last 5 refresh tokens
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    await user.save();

    return { accessToken, refreshToken };
  }

  async handleInstagramOAuth(code) {
    try {
      // Exchange code for short-lived token
      const tokenRes = await axios.post(
        'https://api.instagram.com/oauth/access_token',
        new URLSearchParams({
          client_id: process.env.META_APP_ID,
          client_secret: process.env.META_APP_SECRET,
          grant_type: 'authorization_code',
          redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
          code,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const { access_token: shortLivedToken, user_id: igUserId } = tokenRes.data;

      // Exchange for long-lived token
      const longLivedRes = await axios.get(
        `${META_API_BASE}/access_token`,
        {
          params: {
            grant_type: 'fb_exchange_token',
            client_id: process.env.META_APP_ID,
            client_secret: process.env.META_APP_SECRET,
            fb_exchange_token: shortLivedToken,
          },
        }
      );

      const longLivedToken = longLivedRes.data.access_token;
      const expiresIn = longLivedRes.data.expires_in;

      // Get user profile
      const profileRes = await axios.get(
        `${META_API_BASE}/${igUserId}`,
        {
          params: {
            fields: 'id,username,profile_picture_url,name',
            access_token: longLivedToken,
          },
        }
      );

      return {
        accountId: igUserId,
        accessToken: longLivedToken,
        tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
        username: profileRes.data.username,
        profilePicture: profileRes.data.profile_picture_url,
      };
    } catch (error) {
      logger.error('Instagram OAuth error:', error.response?.data || error.message);
      throw new AppError('Instagram authentication failed.', 400);
    }
  }
}

module.exports = new AuthService();
