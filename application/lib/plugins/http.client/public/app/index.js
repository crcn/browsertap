var plugin = require("plugin"),
dnodePlugin = require("dnode-plugin"),
Url = require("url");

require("./views").registerViews();

plugin().
params({ }).
use(dnodePlugin.client()).
require("dnode://" + window.location.hostname + ":" + window.location.port).
require(require("./plugins/app.part.main")).
require(require("./plugins/app.part.screen")).
require(require("./plugins/app.part.home")).
require(require("./plugins/modelLocator")).
require(require("./plugins/commands")).
require(require("./plugins/router")).
require(require("./plugins/puppeteer")).
require(require("./plugins/app.init")).
load(function(err) {
	if(err) console.error(err.stack); 
});