import mixin from "common/utils/class/mixin"

export default function(schema) {
  return mixin({

    /**
     */

    constructor(properties) {
      Object.assign(this, schema.coerce(properties || {}));
    },

    /**
     */

    get schema() {
      return schema;
    },

    /**
     */

    _toObject(includeInternal) {
      var data = {};
      for (var property in schema.fields) {
        var field = schema.fields[property];
        if (field.internal && includeInternal !== true) continue;
        data[property] = this[property];
      }
      return JSON.parse(JSON.stringify(data));
    },

    /**
     */

    toPublic() {
      return this._toObject(false);
    },

    /**
     */

    toJSON() {
      return this._toObject(true);
    }
  });
};
