var mixin = require("common/utils/class/mixin");
var mesh  = require("mesh");

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