const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    cashfreeSubscriptionId: {
      type: String,
      default: null,
      index: true,
    },
    cashfreePlanId: {
      type: String,
      default: null,
    },
    planName: {
      type: String,
      enum: ['Starter', 'Growth', 'Pro'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'pending', 'failed'],
      default: 'pending',
    },
    currentPeriodStart: {
      type: Date,
      default: null,
    },
    currentPeriodEnd: {
      type: Date,
      default: null,
    },
    paymentHistory: [
      {
        amount: { type: Number, required: true },
        currency: { type: String, default: 'INR' },
        paidAt: { type: Date, default: Date.now },
        cashfreePaymentId: { type: String },
        status: {
          type: String,
          enum: ['success', 'failed', 'pending'],
          default: 'pending',
        },
      },
    ],
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
