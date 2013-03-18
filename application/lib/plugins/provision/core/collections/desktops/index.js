var Desktop = require("./desktop"),
step = require("step"),
outcome = require("outcome"),
closestEC2Region = require("closest-ec2-region"),
comerr = require("comerr"),
verify = require("verify"),
_ = require("underscore");

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

        _.extend(instance, {
          service: "local",
          state: "running",
          region: "local"
        });

        console.log("adding test instance %s", instance.name || instance.address);

        self._source.insert(instance).exec();
      });
    }


    this._watchForBrowsers();
  },

  /**
   */

  "_watchForBrowsers": function() {

    var self = this;
    this._source.watch({ browsers: {$ne:null}}, {
      update: function() {
        self._updateAllBrowsers();
      }
    });
  },

  /**
   */

  "_updateAllBrowsers": function() {

    var used = {}, browsers = [], self = this;

    this._source.findAll(outcome.s(function(servers) {
      for(var i =servers.length; i--;) {
        var server = servers[i], browsers = server.get("browsers");
        for(var j = browsers.length; j--;) {
          var browser = browsers[j],
          key = [browser.name, browser.version].join(".")
          if(used[key]) continue;
          used[key] = 1;
          browsers.push(browser);
        }
      }

      self._browsers = browsers;
    }));
  },

  /**
   */

  "getAvailableBrowsers": function(callback) {
    callback(null, this._browsers || []);
  },


  /**
   * finds a supported region
   */

  "_findRegion": function(options, callback) {

    if(!this._verify.that(options).onError(callback).has("ip").success) {
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

    if(!this._verify.that(options).onError(callback).has("owner", "browserId").success) {
      return;
    }

    var o = outcome.e(callback), self = this, ownerId = String(options.owner._id);

    console.log("finding desktop for %s", ownerId);

    step(

      /**
       * first find the region
       */

      function() {

        if(self._testingMode) {
          console.log("testing mode, not selecting closest region");
          return this();
        }

        self._findRegion(options, this);
      },

      /**
       * next find an available desktop
       */

      o.s(function(region) {

        this.region = region;

        console.log("searching for desktop %s", 
        options.browserId);

        var query = { 

          //first check if there's a server assigned to the particular user
          "owner": { $in: [ ownerId, undefined ] },

          //find a server in running / pending / stopped state
          "state": { $in: ["running", "pending", "stopped"] },

          //servers in THIS region
          "region": region ? region.name : { $ne: undefined },

          //operating system - do we want this? 
          //the idea is to fetch the desktop based on the APPLICATION needed, not the target 
          "browsers": {
            "_id": options.browserId
          }
        };

        if(self._testingMode) {

          console.log("running in test mode, so service must be local");
          query.service = "local";

          //there is no region - it's local.
          delete query.region;
          // delete query.browser;
        }


        self._source.findOne(query, this);
      }),

      /**
       * check if one exists
       */

      o.s(function(desktop) {


        if(desktop) return this(null, desktop);

        console.log("desktop does NOT exist, creating one");


        if(self._testingMode) {
          console.error("cannot create desktops in testing mode!");
          return this(new Error("cannot create desktops in testing mode"));
        }
        
        //otherwise, create one
        self._collections.desktopImages.createDesktop({
          platformName: options.platformName,
          platformVersion: options.platformVersion,
          region: this.region.name,
          flavor: self._options.desktopFlavor,
        }, callback);
      }),

      /**
       */

      o.s(function(desktop) {

        //set the owner - this will be added as a tag
        desktop.setOwner(ownerId);


        console.log("starting desktop");

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
    item.port = this._options.desktopPort;
    item.hosts = this._options.hosts;
    return new Desktop(collection, item);
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