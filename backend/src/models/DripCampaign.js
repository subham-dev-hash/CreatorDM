const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  delayMinutes: { type: Number, required: true, min: 0 },
  messageType: {
    type: String,
    enum: ['text', 'template'],
    default: 'text',
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000,
  },
});

const dripCampaignSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Campaign name is required'],
      trim: true,
      maxlength: 150,
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'completed', 'draft'],
      default: 'draft',
    },
    steps: [stepSchema],
    triggerAutomationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Automation',
      default: null,
    },
    enrolledCount: { type: Number, default: 0 },
    completedCount: { type: Number, default: 0 },
    droppedCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

dripCampaignSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('DripCampaign', dripCampaignSchema);
