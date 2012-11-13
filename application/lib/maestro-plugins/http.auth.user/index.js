var express = require("express"),
outcome = require("outcome"),
vine = require("vine");

exports.require = ["auth"];
exports.plugin = function(auth) {
	var Account = auth.account;

	return function(req, res, next) {
		Account.login(req.body || req.query, outcome.error(function() {
			res.end("Unauthorized");
		}).success(function(account) {
			req.account = account;
			next();
		}));
	}
}