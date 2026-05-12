const { getCashfree } = require('../config/cashfree');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { PLANS } = require('../config/constants');
const logger = require('../config/logger');
const { AppError } = require('../middleware/errorHandler');

class SubscriptionService {
  getPlans() {
    return Object.entries(PLANS).map(([key, plan]) => ({ id: key, ...plan }));
  }

  async createSubscription(userId, planKey) {
    const plan = PLANS[planKey];
    if (!plan) throw new AppError('Invalid plan.', 400);

    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found.', 404);

    const Cashfree = getCashfree();
    if (!Cashfree) {
      // Mock response for development
      const sub = await Subscription.create({
        userId, planName: plan.name, cashfreePlanId: planKey,
        cashfreeSubscriptionId: `mock_sub_${Date.now()}`,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      user.subscription = { planId: planKey, status: 'active', cashfreeSubscriptionId: sub.cashfreeSubscriptionId, currentPeriodStart: sub.currentPeriodStart, currentPeriodEnd: sub.currentPeriodEnd };
      await user.save();
      return { subscription: sub, paymentLink: null };
    }

    try {
      const subRequest = {
        subscription_id: `sub_${userId}_${Date.now()}`,
        plan_id: planKey.toLowerCase(),
        customer_details: { customer_id: userId.toString(), customer_email: user.email, customer_name: user.name, customer_phone: '9999999999' },
        authorization_details: { authorization_amount: plan.price },
        subscription_meta: { return_url: `${process.env.FRONTEND_URL}/settings?payment=success` },
      };

      const response = await Cashfree.PGCreateSubscription(subRequest);
      const sub = await Subscription.create({
        userId, planName: plan.name, cashfreePlanId: planKey,
        cashfreeSubscriptionId: response.data.subscription_id,
        status: 'pending',
      });

      return { subscription: sub, paymentLink: response.data.subscription_payment_link };
    } catch (error) {
      logger.error('Cashfree subscription creation failed:', error);
      throw new AppError('Failed to create subscription.', 500);
    }
  }

  async getSubscriptionStatus(userId) {
    const sub = await Subscription.findOne({ userId }).sort({ createdAt: -1 });
    return sub;
  }

  async cancelSubscription(userId, reason) {
    const sub = await Subscription.findOne({ userId, status: 'active' });
    if (!sub) throw new AppError('No active subscription found.', 404);

    sub.status = 'cancelled';
    sub.cancelledAt = new Date();
    sub.cancellationReason = reason;
    await sub.save();

    await User.findByIdAndUpdate(userId, { 'subscription.status': 'cancelled' });
    return sub;
  }

  async handlePaymentWebhook(eventData) {
    const { subscription_id, payment_status, payment_id, payment_amount } = eventData;
    const sub = await Subscription.findOne({ cashfreeSubscriptionId: subscription_id });
    if (!sub) { logger.warn(`Subscription not found for webhook: ${subscription_id}`); return; }

    if (payment_status === 'SUCCESS') {
      sub.status = 'active';
      sub.currentPeriodStart = new Date();
      sub.currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      sub.paymentHistory.push({ amount: payment_amount, cashfreePaymentId: payment_id, status: 'success', paidAt: new Date() });
      await sub.save();
      await User.findByIdAndUpdate(sub.userId, { 'subscription.status': 'active', 'subscription.currentPeriodEnd': sub.currentPeriodEnd });
    } else if (payment_status === 'FAILED') {
      sub.paymentHistory.push({ amount: payment_amount, cashfreePaymentId: payment_id, status: 'failed', paidAt: new Date() });
      await sub.save();
    }
  }
}

module.exports = new SubscriptionService();
