var Schema = require("./schema");

module.exports = new Schema({
  emailAddress: {
    required: true,
    validate: { $eq: /.*$/ }
  },
  password: {
    required: true,
    private: true,
    validate: { $eq: /\w{3,}/ }
  }
});
