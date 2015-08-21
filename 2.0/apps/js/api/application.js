var BaseApplication = require("common/application");
var extend          = require("lodash/object/extend");

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

  plugins: BaseApplication.prototype.plugins.concat([

    // handles all in-app communication
    require("./bus"),

    // registered commands executable from anywhere in the app
    require("./commands"),

    // http / socket server
    require("./server"),

    // initialize the models
    require("./models")
  ])
});

/**
 */

module.exports = APIApplication;
