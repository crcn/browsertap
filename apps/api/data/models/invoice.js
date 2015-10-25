import Model         from 'common/data/models/base/model'
import Schema        from 'common/data/schema/schema';
import persistMixin  from 'common/data/models/mixins/persist'
import mixinSchema   from 'common/data/schema/mixin';
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

@persistMixin('invoices')
@mixinSchema(invoiceSchema)
class Invoice extends Model {
  
}

/**
 */

export default Invoice;