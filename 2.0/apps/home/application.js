var BaseApplication = require("common/application");
var extend          = require("xtend/mutable");

/**
 */

function HomeApplication(properties) {
  BaseApplication.call(this, properties);
}

/**
 */

extend(HomeApplication.prototype, BaseApplication.prototype, {

});

/**
 */

module.exports = HomeApplication;
