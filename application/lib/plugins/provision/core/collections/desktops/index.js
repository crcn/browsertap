var Machine = require("./machine"),
step = require("step"),
outcome = require("outcome"),
closestEC2Region = require("closest-ec2-region"),
comerr = require("comerr"),
verify = require("verify"),
_ = require("udnerscore");

/** 
 * TODO: 
 * 1. fetch browsers
 * 2. fetch user status every N seconds
 * 3. push desktop info
 */


module.exports = require("../base").extend({

  /**
   */


  "getFreeDesktop": function(options, callback) {

    var accountId = options.owner._id,
    key = "fetch-desktop-" + accountId + "-" + options.platformName + "-" + options.platformVersion;

    this._cache.get(key, _.bind(this._findDesktop, this, options), callback);
  },

  /**
   */

  "init": function() {
    this._verify = verify();
    this._cache = this._options.cache.bucket("desktops");
    this._testingMode = this._options.testingMode;


    //testing mode? insert the test instance!
    if(this._testingMode) {
      var self = this;
      this._options.testingInstances.forEach(function(instance) {
        
        _.extend(instance.service, {
          service: "local",
          state: "running"
        });

        self._source.insert(instance).sync();
      });

    }
  },


  /**
   * finds a supported region
   */

  "_findRegion": function(options, callback) {

    if(!this._verify(options).onError(callback).has("ip").success) {
      return;
    }

    var self = this, o = outcome.e(callback);

    closestEC2Region(options.ip, function(err, regionName) {
      self._getRegisteredRegion(regionName, callback);
    });
  },

  /**
   */

  "_getRegisteredRegion": function(regionName, callback) {
    this._collections.regions.getRegion(regionName, callback);
  },


  /**
   */

  "_findDesktop": function(options, callback) {

    var requiredInfo = [];

    if(!this._verify(options).onError(callback).has("owner", "platformName", "platformVersion", "applicationName", "applicationVersion").success) {
      return;
    }

    var o = outcome.e(callback), self = this, ownerId = String(options.owner._id);

    step(

      /**
       * first find the region
       */

      function() {
        self._findRegion(options, this);
      },

      /**
       * next find an available desktop
       */

      o.s(function(region) {

        var query = { 

          //first check if there's a server assigned to the particular user
          "owner": { $or: [ ownerId, undefined ] },

          //find a server in running / pending / stopped state
          "state": { $or: ["running", "pending", "stopped"] },

          //servers in THIS region
          "region": region.name,

          //operating system
          "os": {

            //windows, ubuntu
            "name": options.platformName,

            //2003, 2008
            "version": options.platformVersion
          },

          //application
          "applicaton": {

            //chrome, firefox
            "name": options.applicationName,

            //18, 19, 4.0.5
            "version": options.applcationVersion
          }
        };

        if(self._testingMode) {
          query.service = "local";

          //there is no region - it's local.
          delete query.region;
        }

        self._source.findOne(query, this);

      }),

      /**
       * check if one exists
       */

      o.s(function(desktop) {
        if(desktop) return this(null, desktop);

        //otherwise, create one
        self._collections.desktopImages.createDesktop({
          platformName: options.platformName,
          platformVersion: options.platformVersion,
          region: region.name,
          flavor: self._options.desktopFlavor,
        }, callback);
      }),

      /**
       */

      o.s(function(desktop) {

        //set the owner - this will be added as a tag
        desktop.setOwner(ownerId);

        //start the desktop
        desktop.start();

        this(null, desktop);
      }),

      /**
       * return the desktop!
       */

      callback
    );
  },

  /**
   */

  "_createModel": function(collection, item) {
    return new Machine(collection, item);
  },

  /**
   */

  "_query": function() {
    return {
      tags: {
        key: "type",
        value: "desktop"
      }
    };
  }
});