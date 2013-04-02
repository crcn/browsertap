process.env.LOG_ECTWO = true;

var config = require("../../config")(process.env.NODE_ENV || "staging"),
step = require("step"),
outcome = require("outcome"),
ectwo = require("ectwo"),
async = require("async"),
verify = require("verify")();

outcome.logAllErrors(true);

var o = outcome;
ec2 = ectwo(config.aws);

//1. scan for master instances


deployInstances(function() {
  console.log("done deploying instances");
  process.exit();
});

function deployInstances(next) {
  step(

    //1. fetch all the master instances in 
    function() {
      ec2.instances.find({ tags: { key:"master", value:"true" } }, this);
    },
    o.s(function(instances) {
      async.eachSeries(instances, deployInstance, this);
    }),
    next
  )
}

function deployInstance(instance, next) {
  console.log("deploying instance %s", instance.get("_id"));

  var tags = instance.tags.toObject(), o = outcome.e(next);

  if(!verify.that(tags).onError(next).has("osName", "osVersion").success)
    return;


  step(

    //1 create the image
    function() {
      instance.createImage({ name: instance.get("name") + "-" + Date.now() }, this);
    },

    //2 migrate the image to other regions
    o.s(function(image) {
      migrateImage(image, this);
    }),

    //3 set images to primary
    o.s(function(images) {
      this.images = images
      async.eachSeries(images, setImageAsPrimary, this);
    }),

    //we're done. The system should periodically check for primary image
    next
  );
}



function setImageAsPrimary(image, next) {

  o = outcome.e(next);
  var imageTags = image.tags.toObject();

  step(

    //find primary iamge
    function() {
      var searchTags = { 
        $and: [
          { tags: { key: "primary", value: "true" } },
          { tags: { key: "osName", value: imageTags.osName } },
          { tags: { key: "osVersion", value: imageTags.osVersion } },
        ]
      }

      image.collection.find(searchTags, this);
    },

    //turn it off
    o.s(function(primaryImages) {
      console.log("turning off %d primary images", primaryImages.length);
      async.eachSeries(primaryImages, function(image, next) {
        image.tags.update({ key: "primary", value: "true"}, { key: "primary", value: "false" }, next);
      }, this);
    }),

    //set new image to primary
    o.s(function() {
      image.tags.create({ key: "primary", value: "true" }, this);
    }),

    //
    o.s(function() {
      image.logger.info("is primary");
      next();
    })
  );
}


function migrateImage(image, next) {
  console.log("migrate image %s", image.get("_id"));

  var o = outcome.e(next);

  step(
    function() {

      //grab all the regions except the source region
      ec2.regions.find({name:{$ne:image.get("region")}}, this);
    },

    //migrate the image to the destination regions
    o.s(function(regions) {
      image.migrate(regions, this);
    }),

    //combine the source image with the migrated images
    o.s(function(images) {
      images.push(image);
      this(null, images);
    }),

    //done
    next
  );
}

