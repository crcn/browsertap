(function() {
  var EventEmitter, browserify, dnode, express, filternet, fs, wrapBrowserClient, wrapScript;

  filternet = require("filternet");

  express = require("express");

  dnode = require("dnode");

  EventEmitter = require("events").EventEmitter;

  browserify = require("browserify");

  wrapBrowserClient = require("./wrapBrowserClient");

  fs = require("fs");

  /*
  */

  exports.listen = function(port) {
    var assetServer, dnodeServer, em, httpPort, mitm, wrap;
    em = new EventEmitter();
    wrap = wrapBrowserClient();
    mitm = filternet.createProxyServer({
      port: port
    });
    assetServer = express.createServer();
    dnodeServer = dnode(function(client, con) {
      return con.on("ready", function() {
        wrap(client, con);
        return em.emit("browserProxy", client);
      });
    });
    httpPort = port + 1;
    assetServer.use(browserify({
      entry: __dirname + "/client/client.js",
      mount: '/client.js'
    }));
    assetServer.listen(httpPort);
    dnodeServer.listen(assetServer);
    mitm.on('interceptResponseContent', function(buffer, responseObject, isSsl, charset, callback) {
      var content, script;
      content = buffer.toString("utf8");
      script = wrapScript("dnode.js", httpPort);
      script += wrapScript("client.js", httpPort);
      return callback(content.replace(/<\/head>/i, script + "</head>"));
    });
    return em;
  };

  /*
  */

  wrapScript = function(path, port) {
    return "<script src=\"http://127.0.0.1:" + port + "/" + path + "?" + (Math.random()) + "\" type=\"text/javascript\"></script>";
  };

}).call(this);
