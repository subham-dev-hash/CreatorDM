const express = require('express');
const Joi = require('joi');
const authService = require('../services/authService');
const { auth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { success, error } = require('../utils/apiResponse');
const User = require('../models/User');
const { META_OAUTH_BASE } = require('../config/constants');

const router = express.Router();

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  name: Joi.string().min(2).max(100).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Register
router.post('/register', authLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return success(res, { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken }, 201);
  } catch (err) { next(err); }
});

// Login
router.post('/login', authLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return success(res, { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken });
  } catch (err) { next(err); }
});

// Refresh Token
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return error(res, 'Refresh token required.', 400);
    const tokens = await authService.refreshAccessToken(refreshToken);
    return success(res, tokens);
  } catch (err) { next(err); }
});

// Logout
router.post('/logout', auth, async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(req.user._id, refreshToken);
    return success(res, null, 200);
  } catch (err) { next(err); }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  return success(res, { user: req.user });
});

// Instagram OAuth redirect
router.get('/instagram', auth, (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID,
    redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
    scope: 'instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list',
    response_type: 'code',
    state: req.user._id.toString(),
  });
  res.redirect(`${META_OAUTH_BASE}?${params.toString()}`);
});

// Instagram OAuth callback
router.get('/instagram/callback', async (req, res, next) => {
  try {
    const { code, state: userId } = req.query;
    if (!code || !userId) return error(res, 'Missing OAuth parameters.', 400);

    const igData = await authService.handleInstagramOAuth(code);
    await User.findByIdAndUpdate(userId, { instagram: igData });

    res.redirect(`${process.env.FRONTEND_URL}/settings?instagram=connected`);
  } catch (err) { next(err); }
});

module.exports = router;
