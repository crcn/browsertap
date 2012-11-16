

exports.require = ["app.http.server", "auth.init", "app.http.auth"];
exports.plugin = function(server, auth, httpAuth) {

	var Account = auth.Account;

	server.get("/live", httpAuth.authCheckpoint, function(req, res) {
		res.render("screen");
	});

	server.get("/login", function(req, res) {
		res.render("login", {
			redirect_to: req.query.redirect_to
		});
	});

	server.get("/logout", function(req, res) {
		delete req.session.token;
		res.redirect("/login");
	});


	server.get("/remoteDesktop", function(req, res) {

	});

	function getToken(req, res, account, render) {
		account.getMainToken(function(err, token) {
			if(err) return res.render(render, {
				error: err.message
			});

			req.session.token = token.key;
			res.redirect(req.body.redirect_to || "/live");
		});
	}

	server.post("/login", function(req, res) {
		Account.login(req.body, function(err, account) {

			if(err) return res.render("login", {
				error: err.message 
			});

			getToken(req, res, account, "login");
		});
	});


	server.get("/signup", function(req, res) {
		res.render("signup");
	});

	server.post("/signup", function(req, res) {
		var acc = new Account(req.body);
		acc.save(function(err) {
			if(err) return res.render("signup", {
				error: err.message
			});

			
			getToken(req, res, acc, "login");
		})
	});


}