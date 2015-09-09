
/**
 */

var auditLogSchema = new Schema({
  fields: {
    name: {
      type: String,
      required: true
    },
    user: {
      type: User,
      required: true
    }
    metadata: Object
  }
});

/**
 */

@mixinSchema(auditLogSchema)
class AuditLog {

}