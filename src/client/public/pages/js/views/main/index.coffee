mojo = require "mojojs"

class MainView extends mojo.View
    
  ###
  ###

  paper: require("./index.pc")

  ###
  ###

  sections: 
    main: 
      type: "states"
      index: 1
      views: [
        { class: require("./auth") , name: "auth" }
        { class: require("./app")  , name: "app"  }
      ]


module.exports = MainView