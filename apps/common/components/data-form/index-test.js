import DataForm from "./index"
import React from "react/addons"
import expect from "expect.js"
import mesh from "common/mesh"
import mixinSchema from "common/data/schema/mixin"
import Schema from "common/data/schema/schema"
import Password from "common/data/types/password"
import EmailAddress from "common/data/types/email-address"
 
describe(__filename + "#", function() {

  function renderDataForm(props) {
    var div = document.createElement("div");
    var component = React.createElement(DataForm, Object.assign({
      app: { bus: mesh.noop }, messages: require("common/translations/en")
    }, props));
    React.render(component, div);
    return div;
  }

  it("can render various forms", function() {

    @mixinSchema(new Schema({
      fields: {
        emailAddress : EmailAddress,
        password     : Password
      }
    }))
    class Form { }

    var div = renderDataForm({ formClass: Form });

    expect(div.querySelector("*[type='password']")).not.to.be(null);
    expect(div.querySelector("*[placeholder='email address']")).not.to.be(null);
  });

  it("enables the submit button once all the fields have been validated", function() {

    @mixinSchema(new Schema({
      fields: {
        emailAddress : EmailAddress,
        password     : Password
      }
    }))
    class Form { }

    var div = renderDataForm({ formClass: Form });

    var emailAddressInput = div.querySelector("*[placeholder='email address']");
    var passwordInput     = div.querySelector("*[type='password']");
    var submitButton      = div.querySelector("*[type='submit']");

    expect(submitButton.disabled).to.be(true);

    // test ui state
    React.addons.TestUtils.Simulate.change(passwordInput);
    expect(passwordInput.parentNode.querySelector(".ion-close")).not.to.be(null);
    passwordInput.value = "password";
    React.addons.TestUtils.Simulate.change(passwordInput);
    expect(passwordInput.parentNode.querySelector(".ion-close")).to.be(null);
    expect(passwordInput.parentNode.querySelector(".ion-checkmark")).not.to.be(null);

    emailAddressInput.value = "a@b.com";
    React.addons.TestUtils.Simulate.change(emailAddressInput);

    expect(submitButton.disabled).to.be(false);
  });

  // it("can render a form that depends on another field", function() {

  // });
}); 