import qs from 'qs';
import DataObject from 'common/data/object';
import extend from 'lodash/object/extend';

/**
 */

class Location extends DataObject {

  constructor(properties) {
    super(properties);
    if (!this.query) this.query   = {};
    if (!this.state) this.state   = {};
  }

  /**
   * Stringifies the location into something like /path/to/route?query=value
   */

  toString() {
    var path = this.pathname;

    if (this.query && !!Object.keys(this.query).length) {
      var q = {};

      // remove blank queries
      for (var key in this.query) {
        var v = this.query[key];
        if (v === '') continue;
        q[key] = v;
      }

      path += '?' + qs.stringify(q);
    }

    return path;
  }
}

export default Location;
