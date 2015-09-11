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
    expect(div.querySelector("*[type='text']")).not.to.be(null);
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

    var emailAddressInput = div.querySelector("*[type='text']");
    var passwordInput     = div.querySelector("*[type='password']");
    var submitButton      = div.querySelector("*[type='submit']");

    expect(submitButton.disabled).to.be(true);

    // test ui state
    React.addons.TestUtils.Simulate.change(passwordInput);

    expect(passwordInput.parentNode.parentNode.querySelector(".ion-close")).not.to.be(null);
    passwordInput.value = "password";
    React.addons.TestUtils.Simulate.change(passwordInput);
    expect(passwordInput.parentNode.parentNode.querySelector(".ion-close")).to.be(null);
    expect(passwordInput.parentNode.parentNode.querySelector(".ion-checkmark")).not.to.be(null);

    emailAddressInput.value = "a@b.com";
    React.addons.TestUtils.Simulate.change(emailAddressInput);

    expect(submitButton.disabled).to.be(false);
  });

  it("can render a form that depends on another field", function() {

    @mixinSchema(new Schema({
      fields: {
        password       : Password,
        repeatPassword : {
          type: Password,
          validate: function(password, data) {
            return String(password) === String(data.password);
          }
        }
      }
    }))
    class Form { }

    var div = renderDataForm({ formClass: Form });

    var submitButton      = div.querySelector("*[type='submit']");

    var emailAddressInput = div.querySelector("*[type='text']");
    var passwordInputs    = div.querySelectorAll("*[type='password']");
    var passwordInput     = passwordInputs[0];
    var passwordInput2    = passwordInputs[1];

    expect(submitButton.disabled).to.be(true);
    passwordInput.value  = "password";
    passwordInput2.value = "password1";

    React.addons.TestUtils.Simulate.change(passwordInput);
    React.addons.TestUtils.Simulate.change(passwordInput2);

    expect(submitButton.disabled).to.be(true);

    passwordInput.value  = "password1";
    React.addons.TestUtils.Simulate.change(passwordInput);
    expect(submitButton.disabled).to.be(false);

    expect(passwordInput2.parentNode.parentNode.querySelector(".ion-checkmark")).not.to.be(null);

  });
}); 