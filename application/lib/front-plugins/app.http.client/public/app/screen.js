var plugin = require("plugin"),
dnodePlugin = require("dnode-plugin"),
Url = require("url");

require("structr").mixin(require("structr-step"));

head.ready(function() {

	require("./tpl").registerViews();


	plugin().
	params({ }).
	require(require("./plugins/router")).
	require(require("./plugins/puppeteer")).
	require(require("./plugins/commands")).
	require(require("./plugins/extbrdg")).
	require(require("./plugins/app.part.main")).
	require(require("./plugins/init")).
	/*require(require("./screen/extbridge")).
	require(require("./screen/router")).
	require(require("./screen/commands")).
	require(require("./screen/screen.part.main")).
	require(require("./screen/puppeteer")).
	require(require("./screen/init")).*/
	load(function(err) {
		if(err) console.error(err.stack || err); 
	});

});


