import mixin from "common/utils/class/mixin";
import cp from "common/utils/bus/create-promise"

export default function(collection) {
  return mixin({

    /**
     */

    constructor() {
        this.on("change", this._pOnChange);
        this._pOnChange(this);
    },

    /**
     */

    _pOnChange(properties) {
        if (properties.data) {
            this.setProperties(this.deserialize(properties.data));
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
