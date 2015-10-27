import Model         from 'common/data/models/model'
import Schema        from 'common/data/schema/schema';
import httperr       from 'httperr';
import Reference     from 'common/data/types/reference';

/**
 */

var invoiceSchema = new Schema({
  fields: {

    /**
     * ID of the user
     */

    _id: {
      type: require('common/data/types/object-id')
    },

    /**
     * ID of the user
     */

    organization: {
      type: Reference
    },

    /**
     */

    amount: {
      type: Number
    }
  }
});

/**
 */

class Invoice extends Model {
  static collectionName = 'invoices';
  constructor(properties) {
    super(invoiceSchema, properties);
  }
}

/**
 */

export default Invoice;
