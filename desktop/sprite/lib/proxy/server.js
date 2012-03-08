(function() {
  var clientScript, dnode, express, filternet, fs, serverScript, wrapScript;

  filternet = require("filternet");

  express = require("express");

  dnode = require("dnode");

  fs = require("fs");

  /*
  */

  exports.listen = function(port) {
    var assetServer, dnodeServer, httpPort, mitm;
    mitm = filternet.createProxyServer({
      port: port
    });
    assetServer = express.createServer();
    dnodeServer = dnode(function() {
      return console.log("CONNECT");
    });
    httpPort = port + 1;
    assetServer.enable("jsonp callback");
    assetServer.get("/client.js", serverScript(httpPort));
    assetServer.listen(httpPort);
    dnodeServer.listen(assetServer);
    return mitm.on('interceptResponseContent', function(buffer, responseObject, isSsl, charset, callback) {
      var content, script;
      content = buffer.toString("utf8");
      script = wrapScript("dnode.js", httpPort);
      script += wrapScript("client.js", httpPort);
      return callback(content.replace(/<\/head>/i, script + "</head>"));
    });
  };

  /*
  */

  clientScript = fs.readFileSync(__dirname + "/client.js", "utf8");

  serverScript = function(port) {
    return function(req, res) {
      return res.end(clientScript.replace("{{host}}", "localhost:" + port));
    };
  };

  /*
  */

  wrapScript = function(path, port) {
    return "<script src=\"http://127.0.0.1:" + port + "/" + path + "?" + (Math.random()) + "\" type=\"text/javascript\"></script>";
  };

}).call(this);
