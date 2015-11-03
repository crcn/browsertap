import Model  from 'common/data/models/model';
import Schema from 'common/data/schema/schema';
import ObjectId from 'common/data/types/object-id';

/**
 */

var machineSchema = new Schema({
  fields: {
    _id: {
      type: String
    }
  }
});

/**
 */

class Machine extends Model {
  static collectionName = 'machines';
  static schema = machineSchema;
}

/**
 */

export default Machine;
