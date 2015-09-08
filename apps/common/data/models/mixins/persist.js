import mixin from "common/utils/class/mixin";
import cp from "common/bus/utils/promise"
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
      var data = yield this.fetch("insert", {
        data : this.toJSON()
      });
      return this;
    },

    /**
     */

    *update() {
      return yield this.fetch("update", {
        data : this.toJSON()
      });
    },

    /**
     */

    *fetch(operationName, properties) {

      var data = yield this.bus.value(Object.assign({
        target     : this,
        name       : operationName,
        collection : collectionName
      }, properties));

      if (data) {
        this.setProperties(data);
      }

      return data;
    }
  });

  return function(clazz) {
    clazz = persistMixin(clazz);

    function *_find(multi, bus, query) {

      var data = yield bus({
        name       : "load",
        multi      : multi,
        query      : query,
        collection : collectionName
      });

      return multi ? data.map(function(data) {
        return new clazz(Object.assign({ bus: bus }, data));
      }) : data ? new clazz(Object.assign({ bus: bus }, data)) : void 0;
    }

    clazz.find    = _find.bind(void 0, true);
    clazz.findOne = _find.bind(void 0, false);

    return clazz;
  }
};
