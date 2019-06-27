(async function (){

  const {data: {plan_id}} = await axios('/plan_id/name');

  paypal.Buttons({
    createSubscription: function(data, actions) {
      return actions.subscription.create({
        plan_id
      });
    },
    // createOrder: function(data, action){
    //   return action.order.create({
    //     purchase_units: [{
    //       amount: {
    //         value: '10'
    //       }
    //     }]
    //   })
    // },
    onApprove: function(data, actions) {
      // Capture the funds from the transaction
      console.log('subscription data: ', data);
      // return actions.order.capture().then(function(details) {
      //   // Show a success message to your buyer
      //   console.log('Transaction completed by ' + details.payer.name.given_name);
      // });
    }
  }).render('#paypal-button')

})();
