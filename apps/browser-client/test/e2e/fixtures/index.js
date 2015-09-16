import User from "common/data/models/user"

/**
 */

export function *create(app) {

  return {
    unverifiedUser : yield _createVerifiedUser(app)
  };
}

function *_createVerifiedUser(app) {

  var data = {
    emailAddress: "unverified@email.com",
    password    : "password"
  };

  var user = new User(Object.assign({ bus: app.bus }, yield app.bus({
    name: "register",
    data: data})));

  yield user.insert();

  return data;
}