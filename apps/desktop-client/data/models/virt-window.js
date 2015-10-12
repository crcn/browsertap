import Model from "common/data/models/base/model";
import persistMixin from "common/data/models/mixins/persist";
import schemaMixin from "common/data/schema/mixin";
import Schema from "common/data/schema/schema";


var schema = new Schema({
  fields: {
    _id: {
      required:true,
      type: require("common/data/types/object-id")
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  }
});

@schemaMixin(schema)
@persistMixin("virtWindows")
class VirtWindow extends Model {

  /**
   */

  startCapture() {

  }
}

export default VirtWindow;
