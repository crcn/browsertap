var plugin = require("plugin"),
_ = require("underscore"),
fs = require("fs"),
sift = require("sift"),
ectwo = require("ectwo");

require("outcome").logAllErrors();

exports.start = function(options) {

	if(!process.env.NODE_ENV) process.env.NODE_ENV = "development";


	var loader = plugin().
	params({
	privateMode: true,
	serviceName: "Browsertap",
	domain: "browsertap.com",
	emailer: {
		postmark: {
			apiKey: "a8442610-e06b-45a3-af06-a605aca343e8",
			from: "support@browsertap.com"
		}
	},
	hosts: {
		rtmp: "rtmp.browsertap.com",
		provision: "provision.browsertap.com"
	},
	desktopFlavor: "c1.medium",
	desktopPort: 8080,
	env: process.env.NODE_ENV,
	runEC2: /staging|production/.test(process.env.NODE_ENV),
	testingMode: /testing|development/.test(process.env.NODE_ENV),
	testing: {
		instances: [
			{
				_id: "local-1",
				address: "127.0.0.1"
			}
		]
	},
	aws: {
		"key": "AKIAJKBGOTIITATBXTIQ",
		"secret": "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", 
		regions: sift(/us-*/, ectwo.regions) // we only want us regions for now
	},
	mongodb: "mongodb://maestro-root:m4estr0d32@alex.mongohq.com:10081/maestro-dev",
	http: {
		port: 80,
		loginRedirect: "/live",
		signupRedirect: "/tools",
		inviteEmailTpl: __dirname + "/plugins/front/app.http.client/views/email/inviteEmailTpl.dust",
		lostPasswordEmailTpl: __dirname + "/plugins/front/app.http.client/views/email/lost_password.dust",
		validateEmailTpl: __dirname + "/plugins/front/app.http.client/views/email/validate_signup.dust",
		compress: true,
		cookies: true,
		mongodb: true,
		xhr: false,
		sslCerts: {
			key: fs.readFileSync(__dirname + "/ssl/browsertap_com.key", "utf8"),
			cert: fs.readFileSync(__dirname + "/ssl/STAR_browsertap_com.crt", "utf8"), 
			ca: [fs.readFileSync(__dirname + "/ssl/PositiveSSLCA2.crt", "utf8"), fs.readFileSync(__dirname + "/ssl/AddTrustExternalCARoot.crt", "utf8")]		
		}
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
	require(__dirname + "/plugins/front").
	require(__dirname + "/plugins/provision");

	loader.load(function(err) {
		if(err) console.error(arguments[0].stack)
	});
}

