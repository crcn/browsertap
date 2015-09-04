import mixin from "common/utils/class/mixin";
import cp from "common/utils/bus/create-promise"

export default function(collection) {
  return mixin({

    /**
     */

    load () {

    },

    /**
     */

    remove () {

    },

    /**
     */

    save() {
        console.log("SV");
    },

    /**
     */

    insert() {

    },

    /**
     */

    update() {

    },

    /**
     */

    *fetch(operationName, properties) {
        return yield cp(this.bus, Object.assign({
            target: this,
            name: operationName
        }, properties));
    }
  });

};
