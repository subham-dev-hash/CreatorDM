const mongoose = require('mongoose');

const automationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Automation name is required'],
      trim: true,
      maxlength: 150,
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'draft'],
      default: 'draft',
    },
    triggerType: {
      type: String,
      enum: ['comment_keyword', 'any_comment'],
      required: true,
    },
    keywords: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    targetMediaIds: [
      {
        type: String, // Instagram media IDs, empty = all posts
      },
    ],
    response: {
      type: {
        type: String,
        enum: ['text', 'template'],
        default: 'text',
      },
      content: {
        type: String,
        required: [true, 'Response content is required'],
        maxlength: 1000,
      },
      buttons: [
        {
          title: { type: String, maxlength: 30 },
          url: { type: String },
        },
      ],
    },
    publicReply: {
      enabled: { type: Boolean, default: false },
      text: { type: String, default: 'Check your DMs! 📩', maxlength: 300 },
    },
    stats: {
      triggered: { type: Number, default: 0 },
      sent: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient lookups
automationSchema.index({ userId: 1, status: 1 });
automationSchema.index({ userId: 1, keywords: 1 });

module.exports = mongoose.model('Automation', automationSchema);
