import mixin from "common/utils/class/mixin";
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
      var data = yield this.fetch("remove", {
        query: { _id: String(this._id) }
      });
      return this;
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
        data : this.toJSON(),
        query: { _id: String(this._id) }
      });
    },

    /**
     */

    *fetch(operationName, properties) {

      var data = yield this.bus.value(Object.assign({
        target     : this,
        name       : operationName,
        collection : collectionName
      }, properties)).read();

      if (data) {
        this.setProperties(this.schema.coerce(Object.assign({}, this, data)));
      }

      return data;
    }
  });

  return function(clazz) {
    clazz = persistMixin(clazz);

    function *_find(multi, bus, query) {

      var response = bus({
        name       : "load",
        multi      : multi,
        query      : query,
        collection : collectionName
      });

      var data;

      if (multi) {
        return (yield response.readAll()).map(function(data) {
          return new clazz(Object.assign({ bus: bus }, data));
        })
      } else {
        var data = yield response.read();
        if (data) return new clazz(Object.assign({ bus: bus }, data));
      }
    }

    clazz.find    = _find.bind(void 0, true);
    clazz.all     = function*(bus) {
      return yield clazz.find(bus);
    };
    clazz.findOne = _find.bind(void 0, false);

    return clazz;
  }
};
