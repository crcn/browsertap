module.exports = require("gumbo").BaseModel.extend({

  /**
   */

  "override __construct": function(collection, item) {
    this._super(collection, item);
    this.init();
  },

  /**
   */

  "set": function(key, value) {
    var set = {};
    set[key] = value;
    this.update({ $set: set });
  },

  /**
   */

  "init": function() {
    //OVERRIDE ME
  },

  /**
   */

  "_targetModel": function() {
    return this.get("_model");
  }
});