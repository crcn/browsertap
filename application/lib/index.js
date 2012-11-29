var plugin = require("plugin"),
maestro = require("maestro"),
_ = require("underscore");


var maestroConfig = require("/usr/local/etc/maestro/config.json");




exports.start = function(type) {


	var loader = maestro(_.extend({
		privateMode: true,
		serviceName: "Browsertap",
		domain: "browsertap.com",
		emailer: {
			postmark: {
				apiKey: "a8442610-e06b-45a3-af06-a605aca343e8",
				from: "support@browsertap.com"
			}
		},
		imageNames: {
			remoteDesktop: "remote-desktop"
		},
		http: {
			port: 8080,
			loginRedirect: "/live",
			inviteEmailTpl: __dirname + "/front-plugins/app.http.client/views/email/inviteEmailTpl.dust",
			lostPasswordEmailTpl: __dirname + "/front-plugins/app.http.client/views/email/lost_password.dust",
			validateEmailTpl: __dirname + "/front-plugins/app.http.client/views/email/validate_signup.dust"
		},
		referralRedirect: "/signup",
		starch: {
			rewards: {
				signup: {
					max: 20,
					credits: 30
				},
				earlyBird: [
					{
						threshold: 1000,
						description: "Early adopter!",
						credits: 30 * 2
					}
				]
			},
			referrals: {
				signup: {
					max: 20,
					credits: 30 //30 minutes
				},
				paid: {
					max: 20,
					credits: 60 * 2//2 hours
				}
			},

			maxSignupReferrals: 20,
			maxPaidReferrals: 20,
			stripe: {
				apiKey: "He4jSn4IlulOTkr1ttGF7F8phzvXDTtb",
				publicKey: "pk_Hdd3MfFfvLS3bx6nJDMeyR0UD97Pj"
			},
			charge: {
				credits: 60,
				amount: 5
			},
			plans: {
				"basic": { //$10
					maxAccounts: 1,
					// rolloverCredits: 600,
					credits: 300
				},
				"pro": { //$20
					maxAccounts: 2,
					// rolloverCredits: 1400,
					credits: 700
				},
				"business": { //$30
					maxAccounts: 4,
					// rolloverCredits: 3600,
					credits: 1800
				}
			}
		},
		simplecache: {
			type: "mongodb"
		}
	}, maestroConfig)).
	paths(__dirname + "/../node_modules").
	require("plugin-express.middleware.dust").
	require("emailer").
	require("auth").
	require("starch").
	require("simplecache").
	require(__dirname + "/front-plugins");

	if(type == "slave") loader.require(__dirname + "/maestro-plugins");


	loader.load(function(err) {
		if(err) console.log(arguments[0].stack)
	});
}

