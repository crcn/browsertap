import mixin from "common/utils/class/mixin";
import cp from "common/utils/bus/create-promise"
import httperr from "httperr"

export default function(collectionName) {

  var persistMixin = mixin({

    /**
     */

    constructor() {
        this.on("change", this._pOnChange);
        this._pOnChange({ properties: this });
    },

    /**
     */

    _pOnChange(changed) {
        if (changed.properties.data) {
            this.setProperties(this.deserialize(changed.properties.data));
        }
    },

    /**
     */

    serialize() {
        // OVERRIDE ME
    },

    /**
     */

    deserialize() {
        // OVERRIDE ME
    },

    /**
     */

    *load () {
      return yield this.fetch("load", {
        query: { _id: this._id }
      });
    },

    /**
     */

    *remove () {

    },

    /**
     */

    *save() {
      return this._id ? this.update() : this.insert();
    },

    /**
     */

    *insert() {
      return yield this.fetch("insert", {
        data : this.serialize()
      });
    },

    /**
     */

    *update() {
      return yield this.fetch("update", {
        data : this.serialize()
      });
    },

    /**
     */

    *fetch(operationName, properties) {

      var data = yield cp(this.bus, Object.assign({
        target     : this,
        name       : operationName,
        collection : collectionName
      }, properties));

      if (data) {
        this.setProperties({
          data: data
        });
      }

      return data;
    }
  });

  return function(clazz) {
    clazz = persistMixin(clazz);

    function *_find(multi, bus, query) {

      var data = yield cp(bus, {
        name       : "load",
        multi      : multi,
        query      : query,
        collection : collectionName
      });

      return multi ? data.map(function(data) {
        return new clazz({ data: data });
      }) : data ? new clazz({ data: data }) : void 0;
    }

    clazz.find    = _find.bind(void 0, true);
    clazz.findOne = _find.bind(void 0, false);

    return clazz;
  }
};
