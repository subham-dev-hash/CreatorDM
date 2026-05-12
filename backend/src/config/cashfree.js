const logger = require('./logger');

let Cashfree = null;

const initCashfree = () => {
  try {
    const cashfreePg = require('cashfree-pg');
    Cashfree = cashfreePg.Cashfree;
    
    Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
    Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
    Cashfree.XEnvironment =
      process.env.CASHFREE_ENV === 'production'
        ? Cashfree.Environment.PRODUCTION
        : Cashfree.Environment.SANDBOX;

    logger.info(`Cashfree initialized in ${process.env.CASHFREE_ENV || 'sandbox'} mode`);
  } catch (error) {
    logger.warn('Cashfree SDK not available. Payment features will be disabled.', error.message);
  }
};

const getCashfree = () => Cashfree;

module.exports = { initCashfree, getCashfree };
