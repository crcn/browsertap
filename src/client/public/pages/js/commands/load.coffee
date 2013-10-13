module.exports = (mediator) ->
  mediator.on "load", (options..., next) -> 

    ###debug
      console.log("loading application")
    ###

    next()