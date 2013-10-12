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
      views: [
        { class: require("./app")  , name: "app"  }
        { class: require("./auth") , name: "auth" }
      ]


module.exports = MainView