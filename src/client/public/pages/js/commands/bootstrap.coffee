module.exports = (mediator) ->
  mediator.on "bootstrap", ["load", "initialize"]