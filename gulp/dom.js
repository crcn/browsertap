
  var jsdom = require("jsdom");

  // JSDOM must be set to global before react is required() (CC)
  global.document = jsdom.jsdom({
    FetchExternalResources: ["script"],
    ProcessExternalResources: ["script"],
    MutationEvents: ["2.0"]
  });

  global.window      = document.defaultView;
  global.navigator   = window.navigator;
  global.document    = window.document;
  global.HTMLElement = window.HTMLElement;
  global.location    = window.location;