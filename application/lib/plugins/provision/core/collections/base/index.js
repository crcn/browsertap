var gumbo = require("gumbo"),
_ = require("underscore"),
structr = require("structr");

module.exports = structr({

  /**
   */

  "override __construct": function(options, collections, target) {

    this._options = options;
    this._target = target;
    this._ectwo  = collections.ectwo;
    this._collections = collections;
    this._source = gumbo.collection([], _.bind(this._createModel, this));
    this._source._controller = this;
    this._super();

    //synchronize the collection from EC2
    target.syncTo(this._query(), this._source);

    this.init();
  },


  /**
   */

  "init": function() {

  },

  /**
   */

  "_createModel": function(collection, item) {
    //OVERRIDE ME
  },

  /**
   */

  "_query": function() {
    return function() { return true; };
  }
});