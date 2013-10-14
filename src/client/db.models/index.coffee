models = {
  User: require("./user")
}


exports.require = ["db.connection"]
exports.load = (db) ->
  m = {}
  for name of models
    m[name] = db.model name, models[name](db)
  m
  