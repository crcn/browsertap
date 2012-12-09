var plugin = require("plugin"),
maestro = require("maestro"),
_ = require("underscore");


var maestroConfig = require("/usr/local/etc/maestro/config.json");




exports.start = function(options) {


	var loader = plugin().
	params({
	privateMode: true,
	serviceName: "Browsertap",
	domain: "browsertap.com",
	maestro: maestroConfig,
	emailer: {
		postmark: {
			apiKey: "a8442610-e06b-45a3-af06-a605aca343e8",
			from: "support@browsertap.com"
		}
	},
	imageIds: {
		remoteDesktop: options.desktopImageId || maestroConfig.desktopImageId
	},
	mongodb: "mongodb://maestro-root:m4estr0d32@alex.mongohq.com:10081/maestro-dev",
	http: {
		port: 80,
		loginRedirect: "/live",
		signupRedirect: "/tools",
		inviteEmailTpl: __dirname + "/front-plugins/app.http.client/views/email/inviteEmailTpl.dust",
		lostPasswordEmailTpl: __dirname + "/front-plugins/app.http.client/views/email/lost_password.dust",
		validateEmailTpl: __dirname + "/front-plugins/app.http.client/views/email/validate_signup.dust",
		compress: true,
		cookies: true,
		xhr: false
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
	}}).
	paths(__dirname + "/../node_modules").
	require("plugin-express").
	require("plugin-express.middleware.dust").
	require("emailer").
	require("auth").
	require("starch").
	require("simplecache").
	require("maestro").
	require(__dirname + "/front-plugins");

	loader.require(__dirname + "/maestro-plugins");


	loader.load(function(err) {
		if(err) console.log(arguments[0].stack)
	});
}

