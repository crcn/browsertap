Region = require("./region"),
verify = require("verify");

module.exports = require("../base").extend({


  /**
   */

  "init": function() {
    this._verify = verify();

    //TODO - synchronize the images

    this._syncRegions();
  },

  /**
   */

  "getRegion": function(options, callback) {

    if(!this._verify.check(options).onError(callback).has("region", "platformName", "platformVersion").success)
      return;

    this._ectwo.regions.findOne()

    var query = { };

    //error, or no region? fetch a default one
    if(err || !region) {
      query = { _id: { $ne: null } };
    } else {
      query = { name: regionName };
    }

    this._ectwo.regions.findOne(query, o.s(function(region) {
      if(!region) return callback(new comerr.NotImplemented("BrowserTap is not yet available in your region!"));
      return callback(null, region);
    }));
  },

  /**
   */

  
  "_createModel": function(collection, item) {
    return new Region(collection, item);
  }
  
});