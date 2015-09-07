import mixin from "common/utils/class/mixin"

export default function(schema) {
  return mixin({

    /**
     */

    constructor(properties) {
      Object.assign(this, schema.coerce(properties || {}));
    }
  });
};
