import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';

// Pricing config mapped to INR
const PLANS = [
  {
    key: 'STARTER',
    name: 'Starter',
    price: '₹499',
    period: '/month',
    description: 'Perfect for new creators getting started with automation.',
    features: [
      '3 Active Automations',
      'Up to 500 Leads/month',
      '1 Drip Campaign',
      'Basic Analytics',
      'Email Support'
    ],
    limitations: [
      'Advanced Lead Scoring',
      'Priority Support',
      'Remove Watermark'
    ],
    popular: false,
    buttonText: 'Start Free Trial',
    buttonClass: 'btn-secondary'
  },
  {
    key: 'GROWTH',
    name: 'Growth',
    price: '₹1,499',
    period: '/month',
    description: 'Ideal for growing accounts with regular lead generation.',
    features: [
      '10 Active Automations',
      'Up to 5,000 Leads/month',
      '5 Drip Campaigns',
      'Advanced Analytics',
      'Remove Watermark',
      'Priority Email Support'
    ],
    limitations: [
      'Dedicated Account Manager'
    ],
    popular: true,
    buttonText: 'Start Free Trial',
    buttonClass: 'btn-primary'
  },
  {
    key: 'PRO',
    name: 'Pro',
    price: '₹3,999',
    period: '/month',
    description: 'For established brands needing unlimited scale.',
    features: [
      'Unlimited Automations',
      'Unlimited Leads',
      'Unlimited Drip Campaigns',
      'Custom Integrations',
      'Remove Watermark',
      'Dedicated Account Manager',
      '24/7 Priority Support'
    ],
    limitations: [],
    popular: false,
    buttonText: 'Contact Sales',
    buttonClass: 'btn-secondary'
  }
];

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="pt-20 pb-16 text-center max-w-3xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Simple, transparent pricing</h1>
        <p className="text-xl text-slate-600">
          No hidden fees. No complex subscriber tiers. Just straightforward pricing in INR.
        </p>

        {/* Billing Toggle (Visual only for now) */}
        <div className="mt-10 flex justify-center items-center">
          <div className="bg-slate-200 p-1 rounded-xl inline-flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingCycle === 'yearly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yearly <span className="ml-1 text-xs text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full">-20%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {PLANS.map((plan) => (
            <div 
              key={plan.key} 
              className={`relative bg-white rounded-2xl shadow-sm border ${
                plan.popular ? 'border-primary-500 shadow-xl md:-mt-4 md:mb-4' : 'border-slate-200 mt-0'
              } flex flex-col p-8 transition-transform hover:scale-[1.02] duration-300`}
            >
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 flex justify-center -mt-3">
                  <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-500 h-12 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-5xl font-extrabold text-slate-900">
                  {billingCycle === 'yearly' && plan.key !== 'PRO' 
                    ? `₹${Math.floor(parseInt(plan.price.replace(/[^\d]/g, '')) * 0.8 * 12).toLocaleString('en-IN')}` 
                    : plan.price}
                </span>
                <span className="text-slate-500 font-medium">
                  {billingCycle === 'yearly' && plan.key !== 'PRO' ? '/year' : plan.period}
                </span>
              </div>

              <Link to="/register" className={`w-full py-3 mb-8 text-center rounded-lg font-medium transition-colors ${
                plan.popular 
                  ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
              }`}>
                {plan.buttonText}
              </Link>

              <div className="space-y-4 flex-grow">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start">
                    <Check className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{feature}</span>
                  </div>
                ))}
                
                {plan.limitations.map((limitation, idx) => (
                  <div key={`lim-${idx}`} className="flex items-start">
                    <X className="w-5 h-5 text-slate-300 mr-3 flex-shrink-0" />
                    <span className="text-slate-400 text-sm">{limitation}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 mt-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-slate-600">Everything you need to know about the product and billing.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <h4 className="text-lg font-bold text-slate-900 mb-2">Can I cancel my subscription anytime?</h4>
            <p className="text-slate-600">Yes, you can cancel your subscription at any time directly from your dashboard. You will continue to have access until the end of your billing period.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <h4 className="text-lg font-bold text-slate-900 mb-2">Do I need an Instagram Business Account?</h4>
            <p className="text-slate-600">Yes, Meta's API requires you to have an Instagram Business or Creator account connected to a Facebook page to use DM automation.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <h4 className="text-lg font-bold text-slate-900 mb-2">What counts as a "Lead"?</h4>
            <p className="text-slate-600">A lead is any unique Instagram user who interacts with your automation (e.g., comments a keyword) within a given billing cycle.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <h4 className="text-lg font-bold text-slate-900 mb-2">Is there a free trial?</h4>
            <p className="text-slate-600">Absolutely! All plans come with a 14-day free trial so you can experience the power of CreatorDM before paying a single Rupee.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <h4 className="text-lg font-bold text-slate-900 mb-2">Can I upgrade or downgrade later?</h4>
            <p className="text-slate-600">Yes, you can easily switch plans from your billing dashboard. Prorated charges or credits will be applied automatically.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <h4 className="text-lg font-bold text-slate-900 mb-2">How safe is this for my account?</h4>
            <p className="text-slate-600">CreatorDM uses the official Instagram Graph API approved by Meta. We comply with all rate limits and platform policies to ensure your account remains safe.</p>
          </div>
        </div>
      </div>

      {/* Guarantee Section */}
      <div className="max-w-4xl mx-auto px-4 mt-24">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 rounded-full blur-[100px] opacity-20"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10">100% Satisfaction Guarantee</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto relative z-10">
            We are confident that CreatorDM will save you time and increase your conversions. If you aren't completely satisfied within your first 30 days, contact us for a full refund.
          </p>
          <button className="bg-white text-slate-900 hover:bg-slate-100 font-bold py-3 px-8 rounded-lg transition-colors relative z-10">
            Start Your Free Trial Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
