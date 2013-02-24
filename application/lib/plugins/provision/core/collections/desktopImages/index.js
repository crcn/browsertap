DesktopImage = require("./image"),
verify       = require("verify");

module.exports = require("../base").extend({


  /**
   */

  "init": function() {
    this._verify = verify();
  },

  /**
   */

  
  "_createModel": function(collection, item) {
    return new DesktopImage(collection, item);
  },


  /**
   */

  "getMostRecentDesktopImage": function(options, callback) {

    if(!this._verify.check(options).onError(callback).has("region", "platformName", "platformVersion").success)
      return;

    var o = outcome.e(callback), self = this;

    step(

      /**
       * first find the target region
       */

      function() {
        self._collections.regions.getRegion(options.region, this);
      },

      /**
       * next find the target image
       */

      o.s(function(region) {

        self.getMostRecentDesktopImage()

        var query = {
          region: region.get("name"),

          //OS we're trying to launch
          os: {
            name: options.platformName,
            version: options.platformVersion
          },

          //MUST have a version - this gets copied over to the instances. If a version is not present, 
          //it's not done being processed.
          version: {
            $ne: undefined
          }
        }

        self._source.findOne(query).sort({ createdAt: -1 }).exec(this);
      }),

      /**
       */

      callback

    );
  },

  /**
   */

  "createDesktop": function(options, callback) {

    if(!this._verify.check(options).onError(callback).has("region", "platformName", "platformVersion").success)
      return;

    this.getMostRecentDesktopImage(outcome.e(callback).s(function(image) {
      image.createDesktop(options, callback);
    }));
  },

  /**
   */

  "_query": function() {
    return {
      tags: {
        key: "type",
        value: "desktop"
      };
    };
  }
});