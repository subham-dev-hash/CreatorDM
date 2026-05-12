module.exports = {
  // JWT
  ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
  REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',

  // Rate limiting
  RATE_LIMIT: {
    GENERAL: { windowMs: 15 * 60 * 1000, max: 100 },
    AUTH: { windowMs: 15 * 60 * 1000, max: 10 },
    WEBHOOK: { windowMs: 1 * 60 * 1000, max: 500 },
  },

  // Queue names
  QUEUES: {
    DM: 'dm-queue',
    COMMENT_REPLY: 'comment-reply-queue',
    CAMPAIGN_STEP: 'campaign-step-queue',
  },

  // Job defaults
  JOB_DEFAULTS: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  },

  // Meta / Instagram
  META_API_BASE: `https://graph.facebook.com/${process.env.META_API_VERSION || 'v21.0'}`,
  META_OAUTH_BASE: 'https://www.facebook.com/v21.0/dialog/oauth',

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },

  // Subscription plans
  PLANS: {
    STARTER: { name: 'Starter', automations: 3, leads: 500, campaigns: 1, price: 499 },
    GROWTH: { name: 'Growth', automations: 10, leads: 5000, campaigns: 5, price: 1499 },
    PRO: { name: 'Pro', automations: -1, leads: -1, campaigns: -1, price: 3999 }, // -1 = unlimited
  },
};
