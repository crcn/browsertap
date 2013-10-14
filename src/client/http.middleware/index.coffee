exports.require = ["config", "http.server", "passport", "express", "connect-mongo"]
exports.load = (config, server, passport, express, connectMongo) ->

  MongoStore = connectMongo(express)
  
  server.use(express.session({
    cookie: {
      maxAge: 3600000
    },
    store: new MongoStore(config.get("mongodb"))
  }))

  server.use(passport.session())  
