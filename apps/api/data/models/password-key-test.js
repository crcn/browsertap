import PasswordKey from "./password-key";

describe(__filename + "#", function() {

  it("can be created", function() {
    new PasswordKey({ secret: "password" });
  });

  it("can be properly converted to JSON", function() {

  });
});