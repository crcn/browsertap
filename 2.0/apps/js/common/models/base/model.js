var extend     = require("xtend/mutable");

/**
 */

function BaseModel(properties) {
  if (properties) extend(this, properties);
}

/**
 */

extend(BaseModel.prototype, {

  /**
   * sets properties on the model
   */

  setProperties: function(properties) {
    for (var key in properties) {
      this[key] = properties[key];
    }
  }
});

/**
 */

module.exports = BaseModel;
