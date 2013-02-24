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
  },

  /**
   */

  "_watch": function() {

    //watch for any instances that might be used
    this._collections.desktops.watch({ os: this.os }, { change: _.bind(this._scaleInstances, this) });

    //watch for any new versions
    this._collections.desktopImages.watch({ os: this.os }, { change: _.bind(this._scaleInstances, this) });
  },


  /**
   */

  "step _scaleInstances": function(next) {

    if(this._scaling) return;
    this._scaling = true;

    var self = this, 
    o = outcome.e(next),
    desktopQuery = { os: image.get("os"), version: image.get("version"), owner: undefined };

    step(

      /**
       * get the most recent image
       */

      function() {
        self._collections.getMostRecentDesktopImage(this);
      },

      /**
       * find *all* the desktops with the given version & is
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
       * find all the desktops that we just created
       */

      o.s(function() {
        self._collections.desktops.find(desktopQuery, this)
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
  }
});