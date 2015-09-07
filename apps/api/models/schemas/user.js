import Schema        from "common/models/schemas/schema"

/**
 */

export default new Schema({

  /**
   */

  _id: { },

  /**
   */

  emailAddress: { 
    req: true, 
    unique: true,
    validate: require("common/utils/validate/email")
  }
});
