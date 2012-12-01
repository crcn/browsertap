var step = require("step"),
vine = require("vine");

exports.require = ["plugin-express", "auth", "customer"];
exports.plugin = function(httpServer, auth, Customer) {


	function retCreditBalance(customer, res) {
		if(customer.creditBalance <= 0) {
			res.send(vine.error("Error no credits left on account").result(customer.creditBalance));
		} else {
			res.send(vine.result(customer.creditBalance));
		}
	}

	httpServer.get("/creditBalance.json", auth.middleware.authCheckpoint, function(req, res) {
		
		console.log("returning credit balance")

		step(
			function() {
				Customer.getCustomer({ account: req.account }, this);
			},
			function(err, customer) {
				retCreditBalance(customer, res);
			}
		);

	})

	httpServer.post("/creditBalance.json", auth.middleware.authCheckpoint, function(req, res) {
		
		console.log("removing %d credits", req.body.usedCredits);

		step(
			function() {
				Customer.getCustomer({ account: req.account }, this);
			},
			function(err, customer) {
				// customer.
				//TODO
				customer.creditBalance = Math.max(0, customer.creditBalance - req.body.usedCredits);

				customer.save(this);
			},
			function(err, customer) {
				retCreditBalance(customer, res);
			}
		);

	})
}