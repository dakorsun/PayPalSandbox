(async function () {

  const {data: token} = await axios.get('/client_token');
  console.log('token: ', token)
  paypal.Button.render({
    braintree,
    client: {
      sandbox: token
    },
    env: 'sandbox',
    commit: true,

    payment: function (data, actions) {
      return actions.braintree.create({
        flow: 'checkout', // Required
        amount: 10.00, // Required
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

    // onAuthorize: function (payload) {
    //   console.log(payload);
    //   axios.post('/checkout', {nonce: payload.nonce});
    // },
    onAuthorize: function (data, actions) {
      // Get the payment details
      return actions.payment.get()
        .then(function (paymentDetails) {
          // Show a confirmation using the details from paymentDetails
          // Then listen for a click on your confirm button
          document.querySelector('#confirm-button')
            .addEventListener('click', function () {
              // Execute the payment
              return actions.payment.execute()
                .then(function () {
                  // Show a success page to the buyer
                });
            });
        });
    }
  }, '#paypal-button');
  console.log('rendered');
})();
