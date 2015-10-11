import User from "common/data/models/user"

/**
 */

exports.create =  async function(app) {
  return {
    unverifiedUser : await _createVerifiedUser(app)
  };
}

async function _createVerifiedUser(app) {

  var data = {
    emailAddress: "unverified@email.com",
    password    : "password"
  };

  var user = new User(Object.assign({ bus: app.bus }, (await app.bus.execute({
    name: "register",
    data: data}).read()).value));

  await user.insert();

  return data;
}
