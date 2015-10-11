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

  var user = new User(Object.assign({ bus: app.bus }, (yield app.bus.execute({
    name: "register",
    data: data}).read()).value));

  yield user.insert();

  return data;
}
