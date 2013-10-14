exports.require = ["config", "mongoose"]
exports.load = (config, mongoose) ->
  inf = config.get "mongodb"
  mongoose.connect "mongodb://#{inf.host}:#{inf.port}/#{inf.db}"
  