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

    toJSON() {
      var data = {};
      for (var property in schema.fields) {
        data[property] = this[property];
      }
      return JSON.parse(JSON.stringify(data));
    }
  });
};
