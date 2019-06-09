require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  sandboxAccessToken: process.env.SANDBOX_CRED,
  braintreePrivateKey: process.env.BRAINTREE_PRIVATE_KEY,
  braintreePublicKey: process.env.BRAINTREE_PUBLIC_KEY,
  merchantId: process.env.MERCHANT_ID
};
