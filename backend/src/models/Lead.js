const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    instagramUserId: {
      type: String,
      required: true,
      index: true,
    },
    instagramUsername: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
      trim: true,
    },
    source: {
      type: String,
      enum: ['comment', 'dm', 'manual'],
      default: 'comment',
    },
    sourceAutomationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Automation',
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    notes: {
      type: String,
      default: '',
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
      default: 'new',
    },
    lastInteraction: {
      type: Date,
      default: Date.now,
    },
    engagementScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    campaignEnrollments: [
      {
        campaignId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'DripCampaign',
        },
        currentStep: { type: Number, default: 0 },
        enrolledAt: { type: Date, default: Date.now },
        completedAt: { type: Date, default: null },
        status: {
          type: String,
          enum: ['active', 'completed', 'dropped'],
          default: 'active',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound unique index: one lead per Instagram user per CreatorDM user
leadSchema.index({ userId: 1, instagramUserId: 1 }, { unique: true });
leadSchema.index({ userId: 1, status: 1 });
leadSchema.index({ userId: 1, tags: 1 });

module.exports = mongoose.model('Lead', leadSchema);
