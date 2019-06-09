const braintree = require('braintree');
const {sandboxAccessToken, braintreePublicKey, braintreePrivateKey, merchantId} = require('../config/env');

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: 'MH94T8XK7JXB8',
  publicKey: braintreePublicKey,
  privateKey: braintreePrivateKey
});

module.exports = {
  getClientToken: async (req, res) => {
    try{
      const response = await gateway.clientToken.generate({});

      res.send(response.clientToken);
    }catch(err){
      res.sendStatus(500);
    }
  },
  receivePaymentMethodNonce: async (req, res) => {
    const {nonce} = req.body;

    const saleRequest = {
      amount: req.body.amount,
      merchantAccountId: "USD",
      paymentMethodNonce: nonce,
      orderId: "Mapped to PayPal Invoice Number",
      descriptor: {
        name: "Descriptor displayed in customer CC statements. 22 char max"
      },
      shipping: {
        firstName: "Jen",
        lastName: "Smith",
        company: "Braintree",
        streetAddress: "1 E 1st St",
        extendedAddress: "5th Floor",
        locality: "Bartlett",
        region: "IL",
        postalCode: "60103",
        countryCodeAlpha2: "US"
      },
      options: {
        paypal: {
          customField: "PayPal custom field",
          description: "Description for PayPal email receipt"
        },
        submitForSettlement: true
      }
    };

    gateway.transaction.sale(saleRequest, function (err, result) {
      if (err) {
        res.send("<h1>Error:  " + err + "</h1>");
      } else if (result.success) {
        res.send("<h1>Success! Transaction ID: " + result.transaction.id + "</h1>");
      } else {
        res.send("<h1>Error:  " + result.message + "</h1>");
      }
    });
  }
};
