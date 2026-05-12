const crypto = require('crypto');

const verifyHmacSignature = (payload, signature, secret, algorithm = 'sha256') => {
  const expectedSignature =
    `${algorithm}=` +
    crypto.createHmac(algorithm, secret).update(payload).digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};

const generateRandomToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

const hashString = (str) => {
  return crypto.createHash('sha256').update(str).digest('hex');
};

module.exports = { verifyHmacSignature, generateRandomToken, hashString };
