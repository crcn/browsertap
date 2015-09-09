import qs from "qs";
import BaseModel from "common/data/models/base/model";
import extend from "lodash/object/extend";

function Location(properties) {
  BaseModel.call(this, properties);
}

/**
 */

extend(Location.prototype, BaseModel.prototype, {

  /**
   * Initial properties
   */

  state: { },
  query: { },

  /**
   * Stringifies the location into something like /path/to/route?query=value
   */

  toString: function() {
    var path = this.pathname;

    if (this.query && !!Object.keys(this.query).length) {
      var q = {};

      // remove blank queries
      for (var key in this.query) {
        var v = this.query[key];
        if (v === "") continue;
        q[key] = v;
      }

      path += "?" + qs.stringify(q);
    }

    return path;
  }
});

module.exports = Location;

