var step = require("step"),
vine = require("vine");

exports.require = ["plugin-express", "auth", "customer", "maestro"];
exports.plugin = function(httpServer, auth, Customer, maestro) {


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
	});

	function findServer(req, res, next) {
		maestro.getServer({ _id: req.body._id }).exec(function(err, server) {
			if(!server) return res.send(vine.error("server doesn't exist"));

			req.server = server;

			next();
		});
	}


	httpServer.post("/keepServerAlive.json", findServer, function(req, res) {

		req.server._logAction("keepAlive");
		req.server.set("lastUsedAt", new Date());
		req.server.set("hadOwner", true);

		res.send(vine.result(true));
	});

	httpServer.post("/serverComplete.json", findServer, function(req, res) {

		req.server._logAction("serverDone");
		// req.server.set("owner", null);
		// req.server.set("hadOwner", true);

		//put it through the SHREDDERRRR
		//VRRRRRRRRRRRRRRRRRRRRRRRRRRRRRREEEEEEEEEEEEEEEEEEEEEEEEEEEeeeeeeeeeeeeeeeeeeeeee.......!!@!#)#(!#)#(#!)#! 
		req.server.terminate();

		res.send(vine.result(true));
	});
}