module.exports = (option, next) ->
  
  ###debug
    console.log("opening application " + option.get("name"))
  ###

  next()