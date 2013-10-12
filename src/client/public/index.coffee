exports.require = ["http.server", "express", "browserify-middleware"]
exports.load = (server, express, browserify) ->
  server.use express.static __dirname + "/pages"
  server.get "/js/index.bundle.js", browserify __dirname + "/pages/js/index.js"