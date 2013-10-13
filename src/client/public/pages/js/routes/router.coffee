hasher = require "hasher"
crossroads = require "crossroads"
mojo = require "mojojs"
events = require "events"


em = new events.EventEmitter()

models = mojo.models

routesByName = {}

# maps paths to "states" object in the model locator
# each view should create a binding to the associated identifier. For instance
# bindings:
#   "models.states.signup": "signupStates.currentName"
redirect = (paths) ->
  models.set "states", paths 


# tie-up crossroads with hasher.js
onHashChange = (newHash, oldHash) ->

  ###debug
    console.log("http redirect %s", newHash)
  ###

  # need to remove the first two chars - !/
  crossroads.parse newHash.substr 1

hasher.changed.add onHashChange
hasher.initialized.add onHashChange

wrapRoute = (pre, route) -> 
  () -> 
    pre (err) ->
      return if err
      redirect route


module.exports = 
  
  getPath: (name) -> routesByName[name] or name

  addRoutes: (routes) ->

    # register the routes with crossroads
    for route of routes
      routeInfo = routes[route]
      routesByName[routeInfo.name] = route
      unless routeInfo.pre
        routeInfo.pre = (next) -> next()

      if routeInfo.states
        cb = wrapRoute routeInfo.pre, routeInfo.states
      else
        cb = routeInfo.enter

      crossroads.addRoute route, cb

    @
  init: () ->
    hasher.init()