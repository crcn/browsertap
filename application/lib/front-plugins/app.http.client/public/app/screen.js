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
	require(require("./plugins/bark")).
	require(require("./plugins/global.errors")).
	load(function(err) {
		if(err) console.error(err.stack || err); 
	});

});


