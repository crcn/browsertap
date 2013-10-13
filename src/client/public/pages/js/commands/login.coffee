module.exports = (mediator) ->
  mediator.on "login", (options, next) ->
    ###debug
      console.log("login")
    ###