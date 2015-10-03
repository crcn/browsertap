import Model   from "common/data/models/base/model";
import Machine from "./machine";

class Machine extends Model {
  *getWindows() {
    return Windows.findOne({ _id: this.machine._id })
  }
}

export default VirtWindow;
