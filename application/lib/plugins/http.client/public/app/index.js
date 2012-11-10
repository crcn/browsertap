var plugin = require("plugin"),
dnodePlugin = require("dnode-plugin"),
Url = require("url");


plugin().
params({ }).
use(dnodePlugin.client()).
require("dnode://" + window.location.hostname + ":" + window.location.port).
require(require("./main/app.part.main")).
require(require("./main/app.part.screen")).
require(require("./main/app.part.home")).
require(require("./main/modelLocator")).
require(require("./main/commands")).
require(require("./main/router")).
require(require("./main/puppeteer")).
require(require("./main/app.init")).
load(function(err) {
require("./views").registerViews();
	if(err) console.error(err.stack); 
});