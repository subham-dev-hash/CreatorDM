const mongoose = require('mongoose');

const messageLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      default: null,
    },
    automationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Automation',
      default: null,
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DripCampaign',
      default: null,
    },
    direction: {
      type: String,
      enum: ['outbound', 'inbound'],
      required: true,
    },
    messageType: {
      type: String,
      enum: ['dm', 'comment_reply'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['queued', 'sent', 'delivered', 'failed'],
      default: 'queued',
    },
    instagramMessageId: {
      type: String,
      default: null,
    },
    errorDetails: {
      code: { type: String, default: null },
      message: { type: String, default: null },
    },
    metadata: {
      commentId: { type: String, default: null },
      mediaId: { type: String, default: null },
    },
  },
  {
    timestamps: true,
  }
);

messageLogSchema.index({ userId: 1, createdAt: -1 });
messageLogSchema.index({ leadId: 1, createdAt: -1 });
messageLogSchema.index({ status: 1 });

module.exports = mongoose.model('MessageLog', messageLogSchema);
