module.exports = (mediator) ->
  mediator.on "signup", (options, next) ->
    ###debug
      console.log("signup")
    ###