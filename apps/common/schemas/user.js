var Schema = require("./schema");

module.exports = new Schema({
  emailAddress: {

  },
  password: {
    private: true,
    map: function(value) {
      return "sha1";
    },
    validate: { $eq: /\w{3,}/ }
  }
});
