(async function () {

  const {data: {token}} = await axios.get('/client_token');
  console.log('token: ', token);

  const clientInstance = await braintree.client.create({
    authorization: token
  });
  const paypalCheckoutInstance = await braintree.paypalCheckout.create({
    client: clientInstance
  });

  console.log('clientInstance: ', clientInstance);
  console.log('clientInstance.configuration: ', clientInstance.getConfiguration());

  console.log('paypalCheckoutInstance: ', paypalCheckoutInstance);

  await paypal.Button.render({
    braintree,
    client: {
      sandbox: token
    },
    env: 'sandbox',

    payment: function () {
      return paypalCheckoutInstance.createPayment({
        flow: 'vault', // Required
        billingAgreementDescription: 'You agree with my rules',
        currency: 'USD', // Required
        enableShippingAddress: true,
        shippingAddressEditable: true,
        // shippingAddressEditable: false,
        shippingAddressOverride: {
          recipientName: 'Scruff McGruff',
          line1: '1234 Main St.',
          line2: 'Unit 1',
          city: 'Chicago',
          countryCode: 'US',
          postalCode: '60652',
          state: 'IL',
          phone: '123.456.7890'
        }
      });
    },

    onAuthorize: function (data, actions) {
      return paypalCheckoutInstance.tokenizePayment(data)
        .then(function (payload) {
          console.log('payload: ', payload);
          console.log('data: ', data);

          return axios.post('/checkout', {nonce: payload.nonce, tokenizedData: data});
        })
    },
  }, '#paypal-button');
  console.log('rendered');
})();
