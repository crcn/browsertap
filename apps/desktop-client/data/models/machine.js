import Model   from 'common/data/models/model';

class Machine extends Model {
  getWindows() {
    return Windows.findOne({ _id: this.machine._id });
  }
}

export default VirtWindow;
