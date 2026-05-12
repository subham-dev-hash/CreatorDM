const User = require('../models/User');
const automationService = require('../services/automationService');
const logger = require('../config/logger');

const handleInstagramWebhook = async (body) => {
  if (!body.object || body.object !== 'instagram') {
    logger.warn('Received non-Instagram webhook');
    return;
  }

  for (const entry of body.entry || []) {
    const igUserId = entry.id;

    // Find the user with this Instagram account
    const user = await User.findOne({ 'instagram.accountId': igUserId });
    if (!user) {
      logger.warn(`No user found for Instagram account ${igUserId}`);
      continue;
    }

    // Process comment changes
    for (const change of entry.changes || []) {
      if (change.field === 'comments') {
        const { id: commentId, text, from, media } = change.value;

        // Skip comments from the account owner (prevent loops)
        if (from?.id === igUserId) continue;

        logger.info(`New comment on media ${media?.id}: "${text}" from ${from?.id}`);

        await automationService.processComment({
          userId: user._id,
          commentText: text,
          commenterId: from?.id,
          commentId,
          mediaId: media?.id,
        });
      }
    }
  }
};

module.exports = { handleInstagramWebhook };
