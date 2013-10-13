router      = require "./router"
mojo        = require "mojojs"
appRoutes   = require "./app"


router.addRoutes appRoutes

mojo.mediator.on "redirect", redirect = (path) ->

  # NOTE - root path is important here, otherwise it'll break tests.
  # setting window.location to something like #!/page will redirect to a parent
  # iframe location.
  window.location = loc = ("/#!/" + router.getPath(path)).replace(/\/+/g,"/")


  ###debug
    console.log("redirect", window.location)
  ###

mojo.mediator.on "pre initialize", (next) ->

  ###debug
    console.log("initializing routes")
  ###
  
  router.init()
  next()
