exports.require = ["http.server", "express", "browserify-middleware"]
exports.load = (server, express, browserify) ->
  server.use express.static __dirname + "/public"
  server.get "/js/index.bundle.js", browserify __dirname + "/public/js/index.js"

