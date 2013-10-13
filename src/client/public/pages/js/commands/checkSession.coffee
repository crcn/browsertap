module.exports = (mediator) ->
  mediator.on "pre load", (next) ->
    ###debug
      console.log("checking session");
    ###
    next();