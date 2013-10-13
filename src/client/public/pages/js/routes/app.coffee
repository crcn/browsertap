module.exports =
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