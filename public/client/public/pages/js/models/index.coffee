mojo = require "mojojs"
bindable = require "bindable"


platforms = new bindable.Object({
  name: "browsertap",
  
  new bindable.Object({ 
    name: "desktop", 
    options:  new bindable.Collection([
      new bindable.Object({
        name: "firefox",
        options: new bindable.Collection([
          new bindable.Object({ name: "7" }),
          new bindable.Object({ name: "8" }),
          new bindable.Object({ name: "9" })
        ])
      })
    ])
  })
})

mojo.models.set "platform", platform