var web = require("/Users/craig/Dropbox/Developer/Public/leche/lib/web.js");
var beanpole = require("beanpole/lib/core");
var router = beanpole.router(),
malt = require('malt');
var beans = ["/node_modules/client/public-src/web/beans/app.core/index.js","/node_modules/client/public-src/web/beans/auth.core/index.js","/node_modules/client/public-src/web/beans/virt.core/index.js","/node_modules/leche.core/shared/beans/malt.core/index.js","/node_modules/leche.core/shared/beans/views.core/index.js","/node_modules/leche.spice.io/shared/beans/connect.core/index.js","/node_modules/leche.spice.io/shared/beans/spice.io.core/index.js","/node_modules/leche.spice.io/web/beans/connect.core/index.js","/node_modules/leche/lib/web/beans/alert.core/index.js","/node_modules/leche/lib/web/beans/element.core/index.js","/node_modules/leche/lib/web/beans/history.core/index.js","/node_modules/leche/lib/web/beans/store.core/index.js","/node_modules/leche/lib/web/beans/template.core/index.js"];
for(var i = beans.length; i--;)
{
	require(beans[i]).plugin(router);
}
require('daisy/lib/beans/hooks.core').plugin(router, {
	name: "web-app"
});
malt.plugin(router);
require('fig/lib/web').plugin(router);
require('daisy/lib/beans/hooks.jsonp').plugin(router);