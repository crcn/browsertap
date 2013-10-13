module.exports = (mediator) ->
  mediator.on "load", (next) -> 

    ###debug
      console.log("loading application")
    ###

    next()