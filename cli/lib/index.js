var plugin = require("plugin"),
config = require("../../application/lib/config")(process.env.NODE_ENV || "development"),
dnodePlugin = require("dnode-plugin");


var loader = plugin().
params({}).
use(dnodePlugin.client()).
require("dnode://" + config.auth.username + ":" + config.auth.password + "@" + config.hosts.provisionDnode).
require(__dirname + "/plugins").
load();
