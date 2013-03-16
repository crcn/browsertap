module.exports = require("gumbo").BaseModel.extend({

  /**
   */

  "override __construct": function(collection, item) {
    this._super(collection, item);
    this.init();
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