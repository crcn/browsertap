var plugin = require("plugin"),
dnodePlugin = require("dnode-plugin"),
Url = require("url");

head.ready(function() {

	require("./mixins/ember");
	require("./tpl").registerViews();


	plugin().
	params({}).
	require(require("./screen/extbridge")).
	require(require("./screen/router")).
	require(require("./screen/commands")).
	require(require("./screen/screen.part.main")).
	require(require("./screen/puppeteer")).
	require(require("./screen/init")).
	load(function(err) {
		if(err) console.error(err.stack || err); 
	});

});


