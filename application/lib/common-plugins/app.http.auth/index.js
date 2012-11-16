var vine = require("vine")
exports.require = ["auth.init", "app.http.server"];
var step = require("step");
exports.plugin = function(auth, server) {

	var Account = auth.Account;



	return {
		authCheckpoint: function(req, res, next) {

			if(req.session.token) {
				q = { token: req.session.token };
			} else {
				q = req.query.token || req.query.email ? req.query : req.body || req.query;
			}

			Account.login(q, function(err, account) {

				if(err) {

					if(/\.json$/.test(req.path)) return res.send(vine.error(new Error("unauthorized")));
					return res.redirect("/login?redirect_to=" +  req.path);
					// return res.send(vine.error(err));
				}
				req.account = account;
				next();
			})
		}
	}
}