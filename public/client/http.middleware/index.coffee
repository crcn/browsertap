exports.require = ["config", "http.server", "passport", "express"]
exports.load = (config, server, passport, express) ->
  server.use(express.session({
    cookie: {
      maxAge: 3600000
    },
    store: 
  }))
  server.use(passport.session())  
