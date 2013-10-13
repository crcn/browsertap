mojo = require "mojojs"
bindable = require "bindable"


platform = new bindable.Object({
  name: "browsertap",
  options: new bindable.Collection([
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
        }),
        new bindable.Object({
          name: "IE",
          options: new bindable.Collection([
            new bindable.Object({ name: "8" }),
            new bindable.Object({ name: "9" }),
            new bindable.Object({ name: "10" })
          ])
        })
      ])
    }),
    new bindable.Object({ 
      name: "mobile", 
      options:  new bindable.Collection([
        new bindable.Object({
          name: "safari",
          options: new bindable.Collection([
            new bindable.Object({ name: "7" }),
            new bindable.Object({ name: "8" }),
            new bindable.Object({ name: "9" })
          ])
        })
      ])
    })
  ])
})

mojo.models.set "platform", platform