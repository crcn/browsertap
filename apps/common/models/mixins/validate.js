import mixin from "common/utils/class/mixin";
import mesh from "mesh";

/**
 */
 
export default function(schema) {
  return mixin({

    /**
     */

    constructor() {
      // console.log(...arguments);
      // TODO - replace bus here with validator bus
    },

    /**
     */

    validate() {
      return schema.validate(this);
    },

    /**
     */

    serialize() {
      return schema.serialize(this);
    },

    /**
     */
    
    deserialize(data) {
      return schema.deserialize(data);
    }
  });
}