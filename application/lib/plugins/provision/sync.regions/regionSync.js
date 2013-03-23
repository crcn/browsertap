var structr = require("structr"),
step = require("step"),
outcome = require("outcome"),
_ = require("underscore"),
EventEmitter = require("events").EventEmitter,
sift = require("sift");

module.exports = structr(EventEmitter, {

  /**
   */

  "__construct": function(options, ectwo) {
    this._ectwo = ectwo;
    this._masterRegion = options.masterRegionName;
  },

  /**
   */

  "start": function(callback) {

    if(!callback) callback = function(){};

    var self = this;

    return;

    self._ectwo.regions.findOne({ name: self._masterRegion }, outcome.s(function(region) {
      if(!region) {
        console.log("cannot start region sync");
        return callback(new Error("region doesn't exist"));
      }

      console.log("watching region %s", region.get("name"));
      self._watchRegionImages(region);
      callback();
    }));
  },

  /**
   * watch for any new images that pop-up from creation
   */

  "_watchRegionImages": function(region) {

    this._region = region;

    var self = this;

    region.images.watch({
      tags: {
        key: "sync",
        value: "true"
      }
    }, {
      change: _.bind(self._syncImages, self)
    });
    
  },

  /**
   */

  "_syncImages": function() {

    console.log("synchronizing images");

    var self = this, o = outcome.e(function(e) {
      self.emit("error", e);
    });


    var query = { 
      tags: [
        { key: "synchronized", value: { $ne: "true" } }, 
        { key: "name", value: { $ne: undefined } }, 
        { key: "createdAt", value: { $ne: undefined } }
      ]
    };

    step(

      /**
       * first find the images to sync
       */

      function() {
        console.log("finding regions");
        self._region.images.find(query, this);
      },

      /**
       * next, find the most recent images 
       */

      o.s(function(images) {

        console.log("finding newest recent images");

        var mostRecent = {}, image;

        for(var i = images.length; i--;) {

          var image  = images[i],
          imageTags  = image.tags.toObject(),
          image2     = mostRecent[imageTags.name],
          image2Tags = image2 ? image2.tags.toObject() : { };

          if(!image2 || imageTags.createdAt > image2Tags.createdAt) {
            mostRecent[imageTags.name] = image2;
          }
        }

        this(null, _.values(mostRecent));
      }),

      /**
       * set the version the the date created at
       */

      o.s(function(images) {
        self._setImageVersions(this.images = images, this);
      }),

      /** 
       * next, copy the images to the new region
       */

      o.s(function() {
        self._syncImages(this.images, this);
      }),

      /**
       */

      function() {
        console.log("done synchronizing region images");
      }
    );
  },

  /**
   */

  "_setImageVersions": function(images, callback) {
    async.forEach(images, function(image, next) {
      image.tags.create({ key: "version", value: image.get("createdAt") }, next);
    }, callback);
  },

  /**
   */

  "_syncImages": function(images, callback) {

    var o = outcome.e(callback), self = this;

    //find all the regions except the master
    self._ectwo.find({ name: { $ne: this._masterRegion }}, o.s(function(regions) {

      //go through each region
      async.forEach(regions, function(region, next) {

        //and each image
        async.forEach(images, function(image, next) {

          //and sync them
          self._syncImage(region, image, next);

        }, next);

      }, callback);
    }));
  },

  /**
   */

  "_syncImage": function(region, image, callback) {
    var o = outcome.e(callback);
    image.migrate(region, o.s(function(migrator) {

      migrator.once("error", callback);

      migrator.on("progress", function(progress) {
        console.log("migrate image %s to %s: %", image.tags.toObject().name, region.get("name"), progress + "%");
      });

      migrator.on("complete", function(newImage) {

        //flag the image so that it doesn't get re-synchronized.
        image.tags.create({ key: "synchronized", value: "false" }, o.s(function() {
          callback(null, newImage);
        }));
      });
    }));
  }
});