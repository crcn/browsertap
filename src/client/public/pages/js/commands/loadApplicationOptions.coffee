PlatformOption = require "../models/platformOption"

module.exports = (mediator) ->
  mediator.on "pre load", (next) ->

    ###debug
      console.log("loading application options");
    ###

    # fixture data for now
    platform = new PlatformOption({
      name: "browsertap",
      options: new bindable.Collection([
        new PlatformOption({ 
          name: "desktop", 
          options:  new bindable.Collection([
            new PlatformOption({
              name: "firefox",
              options: new bindable.Collection([
                new PlatformOption({ name: "7" }),
                new PlatformOption({ name: "8" }),
                new PlatformOption({ name: "9" })
              ])
            }),
            new PlatformOption({
              name: "IE",
              options: new bindable.Collection([
                new PlatformOption({ name: "8" }),
                new PlatformOption({ name: "9" }),
                new PlatformOption({ name: "10" })
              ])
            })
          ])
        }),
        new PlatformOption({ 
          name: "mobile", 
          options:  new bindable.Collection([
            new PlatformOption({
              name: "safari",
              options: new bindable.Collection([
                new PlatformOption({ _id: "7" }),
                new PlatformOption({ _id: "8" }),
                new PlatformOption({ _id: "9" })
              ])
            })
          ])
        })
      ])
    })

    mojo.models.set "platform", platform

    next()