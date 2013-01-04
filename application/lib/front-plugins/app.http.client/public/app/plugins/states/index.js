var EventEmitter = require("events").EventEmitter,
_ = require("underscore");

var stateInfo = {};

[
	{
		"authenticating": {
			m: "Authenticating account"
		}
	},
	{
		"provisioning|stopping|stopped": {
			m: "Starting Server"
		}
	},
	{
		"running": {
			m: "Starting Remote Desktop"
		}
	},
	{
		"opening_app": {
			m: "Starting Application"
		}
	},
	{
		"broadcasting_window": {
			m: "Finding Window"
		}
	},
	{
		"authentication_failure": {
			m: "Authentication failure",
			e: 1
		},
		"complete": {
			m: "Opened application"
		}
	}
].forEach(function(states, i, org) {
	var p = (i+1)/org.length;

	for(var k in states) {
		var state = states[k];
		state.p = p;
		k.split("|").forEach(function(k) {
			stateInfo[k] = state;
		})
	}
});

exports.name = "states";
exports.plugin = function() {
	var em = new EventEmitter();
	em.set = function(code, m) {

		var state = {};

		if(m) state.m = m;

		em.emit("state", _.defaults(state, stateInfo[code]));
	}
	return em;
}