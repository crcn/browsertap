var step = require("step"),
vine = require("vine");

exports.require = ["plugin-express", "auth", "customer", "core"];
exports.plugin = function(httpServer, auth, Customer, core) {


	function retCreditBalance(customer, res) {
		if(customer.creditBalance <= 0) {
			res.send(vine.error("Error no credits left on account").result(customer.creditBalance));
		} else {
			res.send(vine.result(customer.creditBalance));
		}
	}

	httpServer.get("/creditBalance.json", auth.middleware.authCheckpoint, function(req, res) {
		
		console.log("returning credit balance");

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
	});


	function findServer(req, res, next) {

		core.collections.desktops._source.findOne({ _id: req.body._id }).exec(function(err, server) {
			if(!server) return res.send(vine.error("server doesn't exist"));

			req.server = server;

			next();
		});
	}


	httpServer.post("/keepServerAlive.json", findServer, function(req, res) {

		//req.server._logAction("keepAlive");
		console.log("keep alive %s", req.server.get("_id"))
		req.server.set("lastUsedAt", new Date());

		res.send(vine.result(true));
	});

	httpServer.post("/serverComplete.json", findServer, function(req, res) {

		console.log("desktop done %s", req.server.get("_id"))
		req.server.setOwner(null);


		res.send(vine.result(true));
	});
}