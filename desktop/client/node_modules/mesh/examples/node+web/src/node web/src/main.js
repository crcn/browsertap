
var beanpoll = require('beanpoll'),
haba         = require('haba'),
router       = beanpoll.router();


pluginLoader = haba.loader();

pluginLoader.
options(router).
paths(__dirname + "/node_modules").
params({
	publicDir: __dirname + "/../web"
}).
require(__dirname + "/plugins").
require('fig').
require('mesh-http').
load();

exports.router = router;


