var plugin = require("plugin"),
dnodePlugin = require("dnode-plugin"),
Url = require("url");

head.ready(function() {

	require("./mixins/ember");
	require("./views").registerViews();


	plugin().
	params({ }).
	//TODO - use() middleware that connects to the parent window
	use(dnodePlugin.client()).
	require("dnode://" + window.location.hostname + ":" + window.location.port).
	require(require("./common/router")).
	require(require("./common/commands")).
	require(require("./screen/screen.part.main")).
	require(require("./screen/puppeteer")).
	require(require("./common/init")).
	load(function(err) {
		if(err) console.error(err.stack || err); 
	});
})


