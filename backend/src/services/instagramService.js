const axios = require('axios');
const { META_API_BASE } = require('../config/constants');
const logger = require('../config/logger');

class InstagramService {
  /**
   * Send a DM to an Instagram user
   */
  async sendDirectMessage(igUserId, recipientId, message, accessToken) {
    try {
      const response = await axios.post(
        `${META_API_BASE}/${igUserId}/messages`,
        {
          recipient: { id: recipientId },
          message: { text: message },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info(`DM sent to ${recipientId}`, { messageId: response.data.message_id });
      return {
        success: true,
        messageId: response.data.message_id,
      };
    } catch (error) {
      const errData = error.response?.data?.error || {};
      logger.error('Instagram DM send failed:', {
        recipientId,
        error: errData,
      });

      // Check if rate limited
      if (error.response?.status === 429 || errData.code === 4) {
        throw Object.assign(new Error('Rate limited by Instagram API'), {
          retryable: true,
          retryAfter: parseInt(error.response?.headers['retry-after'] || '60', 10),
        });
      }

      throw Object.assign(new Error(errData.message || 'Failed to send DM'), {
        retryable: false,
        igErrorCode: errData.code,
      });
    }
  }

  /**
   * Reply to a comment on a media post
   */
  async replyToComment(commentId, message, accessToken) {
    try {
      const response = await axios.post(
        `${META_API_BASE}/${commentId}/replies`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info(`Comment reply sent on ${commentId}`);
      return { success: true, commentId: response.data.id };
    } catch (error) {
      logger.error('Comment reply failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get media info
   */
  async getMediaInfo(mediaId, accessToken) {
    try {
      const response = await axios.get(`${META_API_BASE}/${mediaId}`, {
        params: {
          fields: 'id,caption,media_type,media_url,timestamp,permalink',
          access_token: accessToken,
        },
      });
      return response.data;
    } catch (error) {
      logger.error('Get media info failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Refresh a long-lived access token
   */
  async refreshLongLivedToken(currentToken) {
    try {
      const response = await axios.get(`${META_API_BASE}/oauth/access_token`, {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: process.env.META_APP_ID,
          client_secret: process.env.META_APP_SECRET,
          fb_exchange_token: currentToken,
        },
      });

      return {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
      };
    } catch (error) {
      logger.error('Token refresh failed:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new InstagramService();
