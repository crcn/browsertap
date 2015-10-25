import cstripe            from 'stripe'

export default function(app) {
  app.stripe = app.get('config.stripe.mock') ? mock() : cstripe(app.get('config.stripe.sk'));
};

function mock() {
  return {
    customers: {
      create: function() {
        return new Promise(function(resolve, reject) {
          resolve({
            id: 'customer1'
          });
        });
      }
    },
    charges: {
      create: function() {
        return new Promise(function(resolve, reject) {
          resolve({
            id: 'charge1'
          });
        });
      }
    }
  }
}
