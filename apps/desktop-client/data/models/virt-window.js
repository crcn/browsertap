import Model from 'common/data/models/model';
import Schema from 'common/data/schema/schema';
import Peer from './peer';


var schema = new Schema({
  fields: {
    _id: {
      required:true,
      type: require('common/data/types/object-id')
    },
    machine: {
      type: Object
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  }
});

class VirtWindow extends Model {
  static collectionName = 'virtWindows';
  static schema = schema;

  /**
   */

  async startCapture() {
    var {value} = await this.fetch('startWindowSession').read();
    var peer = new Peer(Object.assign({ bus: this.bus }, value));
    await peer.connect();
    return peer;
  }
}

export default VirtWindow;
