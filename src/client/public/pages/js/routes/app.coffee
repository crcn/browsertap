module.exports =
  "/":
    states:
      main : "app"
      app  : "screen"

  "/login": 
    states:
      main: "auth"
      auth: "login"

  "/signup":
    states:
      main: "auth"
      auth: "signup"

  "/forgot":
    states:
      main: "auth"
      auth: "forgot"

  "/settings":
    name: "settings"
    states:
      main     : "app"
      app      : "screen"
      settings : "options"

  "/settings/payment":
    name: "payment"
    states:
      main     : "app"
      app      : "screen"
      settings : "payment"

  "/settings/browsers":
    name: "browsers"
    states:
      main     : "app"
      app      : "screen"
      settings : "browsers"

  "/settings/extensions":
    name: "extensions"
    states:
      main     : "app"
      app      : "screen"
      settings : "extensions"

  "/settings/report-bug":
    name: "reportBug"
    states:
      main     : "app"
      app      : "screen"
      settings : "reportBug"

  "/settings/help":
    name: "help"
    states:
      main     : "app"
      app      : "screen"
      settings : "help"

  "/settings/contact":
    name: "contact"
    states:
      main     : "app"
      app      : "screen"
      settings : "contact"

  "/settings/tunnel":
    name: "tunnel"
    states:
      main     : "app"
      app      : "screen"
      settings : "tunnel"