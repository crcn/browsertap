(function() {
  var Controller;

  Controller = require("./controller");

  exports.create = function(config) {
    return new Controller().config(config);
  };

  exports.create({
    directory: "~/Desktop/browsers"
  }).listen(8088);

  /*
  proxy = filternet.createProxyServer({ port: 8088 })
  
  proxy.on "interceptResponseContent", (buffer, responseObject, isSsl, charset, callback) ->
  	console.log(responseObject)
  	console.log("GO")
  	content = buffer.toString('utf8')
  	css = "<"+"link rel='stylesheet' href='http://axiak.github.com/filternet/blink.css'>"
  	callback(content.replace(/<\/head>/i, css + "</head>"))
  */

}).call(this);
