module.exports = (mediator) ->
  mediator.on "pre load", (options..., next) =>

    ###debug
      console.log("waiting for the DOM to be ready")
    ###

    $(document).ready () -> 
      next()