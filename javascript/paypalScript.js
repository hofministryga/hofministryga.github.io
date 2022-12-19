/*
////////////////////////////////////////////////////////////////////
///////Not yet implemented. Must obtain client ID from paypal///////
////////////////////////////////////////////////////////////////////

Sample Code obtained from https://developer.paypal.com/docs/checkout/standard/integrate/
*/

paypal.Buttons({
    // Sets up the transaction when a payment button is clicked

    createOrder: function(data, actions) {

      return actions.order.create({

        purchase_units: [{

          amount: {

            value: '1.00' // Can reference variables or functions. Example: `value: document.getElementById('...').value`

          }

        }]

      });

    },


    // Finalize the transaction after payer approval

    onApprove: function(data, actions) {

      return actions.order.capture().then(function(orderData) {

        // Successful capture! For dev/demo purposes:

            console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));

            var transaction = orderData.purchase_units[0].payments.captures[0];

            alert('Transaction '+ transaction.status + ': ' + transaction.id + '\n\nSee console for all available details');


        // When ready to go live, remove the alert and show a success message within this page. For example:

        // var element = document.getElementById('paypal-button-container');

        // element.innerHTML = '';

        // element.innerHTML = '<h3>Thank you for your payment!</h3>';

        // Or go to another URL:  actions.redirect('thank_you.html');

      });

    }

  }).render('#paypal-button-container');