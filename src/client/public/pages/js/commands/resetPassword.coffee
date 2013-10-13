module.exports = (mediator) ->
  mediator.on "resetPassword", (options, next) ->
    console.log "RESET"