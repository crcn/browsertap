module.exports = 
  getOptions: (view) ->
    view.route
  decorate: (view, route) ->
    binding = view.bind("models.states.#{route}", "currentName").now()
    view.once "remove", binding.dispose