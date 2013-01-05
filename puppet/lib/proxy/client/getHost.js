var Url = require("url");
module.exports = function() {
	var els = document.getElementsByTagName("script"), script;
	for(var i = els.length; i--;) {
		script = els[i];
		if(~script.src.indexOf("?dnodeClient")) break;
	}
	return parseUrl(script.src);
}
function parseUrl( url ) {
    var a = document.createElement('a');
    a.href = url;
    return a;
}