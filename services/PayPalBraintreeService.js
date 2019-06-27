const {sandboxAccessToken, braintreePublicKey, braintreePrivateKey, merchantId} = require('../config/env');
const braintree = require('braintree');

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId,
  publicKey: braintreePublicKey,
  privateKey: braintreePrivateKey,
});


// console.log('gateway: ', gateway);

TRANSACTION_SUCCESS_STATUSES = [
  braintree.Transaction.Status.Authorizing,
  braintree.Transaction.Status.Authorized,
  braintree.Transaction.Status.Settled,
  braintree.Transaction.Status.Settling,
  braintree.Transaction.Status.SettlementConfirmed,
  braintree.Transaction.Status.SettlementPending,
  braintree.Transaction.Status.SubmittedForSettlement
];

module.exports = {
  getClientToken: async (req, res) => {
    try {
      const response = await gateway.clientToken.generate({});

      res.send({token: response.clientToken});
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  },
  receivePaymentMethodNonce: async (req, res) => {
    const {nonce, tokenizedData: {paymentToken, billingToken}} = req.body;



    try {

      const saleRequest = {
        amount: "10.00 ",
        // merchantAccountId: "USD",
        // paymentMethodNonce: nonce,
        paymentMethodToken: paymentToken,
        // paymentMethodToken: billingToken,
        // orderId: "Mapped to PayPal Invoice Number",
        shipping: {
          firstName: "Jen",
          lastName: "Smith",
          streetAddress: "1 E 1st St",
          extendedAddress: "5th Floor",
          locality: "Bartlett",
          region: "IL",
          postalCode: "60103",
          countryCodeAlpha2: "US"
        },
        options: {
          // storeInVaultOnSuccess: true,
          storeInVault: true,
          paypal: {
            customField: "PayPal custom field",
            description: "Description for PayPal email receipt"
          },
          submitForSettlement: true
        }
      };

      const result = await gateway.transaction.sale(saleRequest);
      if (result.success) {
        // res.send("<h1>Success! Transaction ID: " + result.transaction.id + "</h1>");
        console.log('transaction id: ', result.transaction.id)
        res.redirect(`/checkout/${result.transaction.id}`);

      } else {
        console.log(result.message)
        res.status(500).send("<h2>Error:  " + result.message + "</h2><h1>Transaction ID:  " + result.transaction. id + "</h1>");
      }
    } catch (err) {
      console.error(err)
      res.status(500).send("<h1>Error:  " + err + "</h1>");
    }
    // gateway.transaction.sale(saleRequest, function (err, result) {
    //   if (err) {
    //     res.send("<h1>Error:  " + err + "</h1>");
    //   } else if (result.success) {
    //     res.send("<h1>Success! Transaction ID: " + result.transaction.id + "</h1>");
    //   } else {
    //     res.send("<h1>Error:  " + result.message + "</h1>");
    //   }
    // });
  },
  getTransaction: async (req, res) => {
    const transaction = await gateway.transaction.find(req.params.id);
    res.send(transaction);

  }
};
