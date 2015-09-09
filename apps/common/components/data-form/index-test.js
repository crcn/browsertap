import DataForm from "./index"
import React from "react"
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
      app: { bus: mesh.noop }
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
}); 