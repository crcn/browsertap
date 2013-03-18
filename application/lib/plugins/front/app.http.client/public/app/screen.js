var plugin = require("plugin"),
dnodePlugin = require("dnode-plugin"),
Url = require("url");

require("structr").mixin(require("structr-step"));

function ready() {

	require("./tpl").registerViews();


	plugin().
	params({
		host: [window.location.protocol, "//", window.location.host].join("")
	}).
	require(require("./plugins/router")).
	require(require("./plugins/availablebrowsers")).
	require(require("./plugins/puppeteer")).
	require(require("./plugins/states")).
	require(require("./plugins/commands")).
	require(require("./plugins/keys")).
	require(require("./plugins/extbrdg")).
	require(require("./plugins/app.part.main")).
	require(require("./plugins/init")).
	require(require("./plugins/bark")).
	require(require("./plugins/global.errors")).
	load(function(err) {
		if(err) console.error(err.stack || err); 
	});

};

$(document).ready(ready);


