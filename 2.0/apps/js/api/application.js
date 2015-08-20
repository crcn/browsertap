var BaseApplication = require("common/application");
var extend          = require("xtend/mutable");

/**
 */

function APIApplication(properties) {
  BaseApplication.call(this, properties);
}

/**
 */

extend(APIApplication.prototype, BaseApplication.prototype, {

  /**
   */

  plugins: [

    // handles all in-app communication
    require("./bus"),

    // registered commands executable from anywhere in the app
    require("./commands"),

    // http / socket server
    require("./server")
  ]
});

/**
 */

module.exports = APIApplication;
