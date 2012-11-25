var vine = require("vine"),
step = require("step"),
outcome = require("outcome"),
dust = require("dustjs-linkedin"),
fs = require("fs"),
vm = require("vm"),
emailify = require("emailify"),
_ = require("underscore");


// console.log(eval(dust.compile(fs.readFileSync(__dirname + "/views/email/lost_password.dust", "utf8"))).toString());

exports.require = ["app.http.server", "auth.init", "app.http.auth", "./models", "email.postmark"];
exports.plugin = function(server, auth, httpAuth, models, emailer) {

	eval(dust.compile(fs.readFileSync(__dirname + "/views/email/lost_password.dust", "utf8"), "lostPasswordEmailTpl"));


	var Account = auth.Account,
	LostPassword = models.LostPassword;

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


	server.get("/lost_password", function(req, res) {
		res.render("lost_password");
	});

	function lostPasswordExists(req, res, next) {
		var on = outcome.error(function(err) {
			res.send(vine.error(err).data);
		});

		step(
			function() {
				LostPassword.findOne({ _id: req.query.token || req.body.token }, this);
			},
			on.success(function(lostPassword) {
				if(!lostPassword) {
					return res.render("lost_password", vine.error("The reset password token does not exist.").data);
				} else 
				if(lostPassword.expiresAt.getTime() < Date.now()) {
					lostPassword.remove();
					return res.render("lost_password", vine.error("The reset password link has expired.").data);
				}

				req.lostPassword = lostPassword;
				this();
			}),
			next
		);
	}

	server.get("/reset_password", lostPasswordExists, function(req, res) {
		res.render("reset_password", {
			token: req.query.token
		});
	});

	server.post("/reset_password", lostPasswordExists, function(req, res) {
		var on = outcome.error(function(err) {
			res.send(vine.error(err).data);
		});

		step(
			function() {
				if(req.body.password.length < 6) {
					console.log(vine.error(new Error("password must be at least 6 characters")).data)
					return res.render("reset_password", _.extend(req.query, vine.error(new Error("password must be at least 6 characters")).data));
				}

				if(req.body.password != req.body.password2) {
					return res.render("reset_password", _.extend(req.query, vine.error(new Error("passwords don't match")).data));
				}

				this();
			},
			function() {
				Account.findOne({ _id: req.lostPassword.account }, this);
			},
			on.success(function(account) {
				if(!account) return res.render("reset_password", _.extend(req.query, vine.error(new Error("account doesn't exist")).data));
				account.password = req.body.password;
				account.save(this);
			}),
			on.success(function(account) {
				res.render("login", vine.message("Please re-login with your new password").data);
				req.lostPassword.remove();
			})
		);
	});

	server.post("/lost_password", function(req, res) {

		var on = outcome.error(function(err) {
			res.send(vine.error(err).data);
		});

		step(
			function() {
				Account.findOne({ email: req.body.email }, this);
			},
			on.success(function(account) {
				if(!account) return on(new Error("account does not exist"));
				this.account = account;
				
				var lostPassword = new LostPassword({ account: account._id });

				lostPassword.save(this);
			}),
			on.success(function(lostPassword) {
				var next = this;

				dust.render("lostPasswordEmailTpl", { email: "email", token: lostPassword._id }, on.success(function(tpl) {
					emailify.parse(tpl, {}, next);
				}));

				
			}),
			on.success(function(tpl) {
				var next = this;
				emailer.send({
					to: this.account.email,
					subject: "Reset Password",
					body: tpl
				}, function(err) {
					if(err) return on(new Error("Unable to send password recovery email"));
					next();
				})
			}),
			on.success(function() {
				res.render("lost_password_sent", {
					email: this.account.email
				});
			})
		);
	});


	server.get("/account.json", httpAuth.authCheckpoint, function(req, res) {
		res.send(vine.result(req.account.toObject()).data);
	});

	server.get("/upgrade", httpAuth.authCheckpoint, function(req, res) {
		res.render("upgrade");
	});


	function getToken(req, res, account, render) {
		account.getMainToken(function(err, token) {
			if(err) return res.render(render, {
				error: err.message
			});

			req.session.token = token.key;
			res.redirect(req.query.redirect_to || "/live");
		});
	}

	server.post("/login", function(req, res) {
		Account.login(req.body, function(err, account) {

			if(err) return res.render("login", _.extend(req.query, vine.error(err).data));

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