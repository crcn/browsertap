Region = require("./region"),
verify = require("verify");

module.exports = require("../base").extend({


  /**
   */

  "init": function() {
    this._verify = verify();
  },

  /**
   */

  "getRegion": function(options, callback) {

    if(!this._verify.check(options).onError(callback).has("region", "platformName", "platformVersion").success)
      return;

    console.log("fetching target EC2 region");

    var query = { };

    //error, or no region? fetch a default one
    if(err || !region) {
      query = { _id: { $ne: null } };
    } else {
      query = { name: regionName };
    }

    this._ectwo.regions.findOne(query, o.s(function(region) {

      if(!region) {
        console.log("region does NOT exist, sending back 'not ready' error.");

        return callback(new comerr.NotImplemented("BrowserTap is not yet available in your region!"));
      }


      console.log("found ec2 region=%s", region.get("name"));

      return callback(null, region);
    }));
  },

  /**
   */

  
  "_createModel": function(collection, item) {
    return new Region(collection, item);
  }
  
});