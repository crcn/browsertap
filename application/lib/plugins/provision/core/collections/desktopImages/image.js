var outcome = require("outcome");

module.exports = require("../base").extend({

  /**
   */

  "init": function() {
    this._image = this._targetModel();
    this._testingMode = this._options.testingMode;
  },

  /**
   */

  "createDesktop": function(options, callback) {

    if(this._testingMode) {
      return callback(new Error("cannot create a desktop while in testing mode"));
    }

    // this.collection._controller._collections.
    var self = this;

    this._image.createInstance({ flavor: options.flavor }, outcome.e(callback).s(function(instance) {


      //synchronization will happen immediately
      setTimeout(function() {

        //fucking yuck.
        self.collection._controller._collections.desktops._source.findOne({ _id: instance.get("_id") }, callback);

      }, 1);
    }));
  }
});