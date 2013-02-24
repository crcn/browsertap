var structr = require("structr"),
_ = require("underscore"),
step = require("step");


module.exports = structr({

  /**
   */

  "__construct": function(options, collections) {
    this.os = options.os;
    this._collections = collections;
    this._watch();

    //this needs to be scaled
    this._minRunning = 1;
    this._flavor = options.flavor;
    this._stopTime = 1000 * 60 * 5;
  },

  /**
   */

  "_watch": function() {

    //watch for any instances that might be used
    this._collections.desktops.watch({ os: this.os }, { change: _.bind(this._scaleInstances, this) });

    //watch for any new versions
    this._collections.desktopImages.watch({ os: this.os }, { change: _.bind(this._scaleInstances, this) });


    setInterval(_.bind(this._downscale, this), 1000 * 60);
  },


  /**
   */

  "step _scaleInstances": function(next) {

    if(this._scaling) return;
    this._scaling = true;

    var self = this, 
    o = outcome.e(next),
    desktopQuery = this._desktopQuery();

    step(

      /**
       * get the most recent image
       */

      function() {
        self._collections.getMostRecentDesktopImage(this);
      },

      /**
       * find *all* the desktops with the given version & doesn't have an
       */

      o.s(function(image) {
        this._image = image;
        self._collections.desktops.count(desktopQuery, this)
      }),


      /**
       * count 'em, and create 'em
       */

      o.s(function(count) {

        var numToCreate = Math.max(count - self._minRunning, 0),
        next = this;

        function create() {
          if(!numToCreate) return next();
          self._image.createDesktop({ flavor: self._flavor }, outcome.e(next).s(create));
        }

        create();
      }),

      /**
       * find all the desktops that we just created, or ones that are stopped
       */

      o.s(function() {
        self._collections.desktops.find(desktopQuery).limit(this._minRunning).exec(this);
      }),

      /**
       */

      o.s(function(desktops) {

        //start the desktops
        desktops.forEach(function(desktop) {
          desktop.start();
        });

        this();
      }),

      /**
       */

      next
    );
  },

  /**
   */

  "_desktopQuery": function() {
    return { os: image.get("os"), version: image.get("version"), owner: undefined };
  },


  /**
   */

  "step _downscale": function(next) {

    var self = this,
    desktopQuery = this._desktopQuery(),
    o = outcome.e(next);

    step(

      /**
       * find all the runnign instances that haven't been used for a while
       */

      function() {

        var q = _.extend(desktopQuery, { 
          state: "running", 
          lastUsedAt: { $lt: Date.now() -  self._stopTime } 
        });

        //don't limit - we need to make sure there are enough items
        self._collections.desktops.find(q, this);
      },

      /**
       * stop them
       */

      o.s(function(desktops) {

        //5, 4
        //make sure we have a min number of running servrs
        if(desktops.length <= self._minRunning) return;
          
        //only turn off what's needed - also skip any spot instances
        var toTurnOff = desktops.filter(function(desktop) {
          return !!desktop.get("isSpot");
        }).slice(0, desktops.length - self._numRunning);

        console.log("turning off %d instances", toTurnOff.length);

        async.forEach(toTurnOff, function(desktop, next) {
          desktop.stop(next);
        }, this);
      }),

      /**
       */

      next

    );
  }
});