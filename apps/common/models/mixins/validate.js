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
      // TODO - replace bus with stop-gap
    },

    /**
     */

    validate() {
      return schema.validate(this);
    }
    
  });
}