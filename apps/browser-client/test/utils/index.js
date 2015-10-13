import apiTestUtils from "api/test/utils";
import application from "../../application";
import { AttachDefaultsBus } from "mesh";
import fixtures from "../fixtures/index";
var React  = require("react/addons");

module.exports = {
  createFakeApp: async function(properties) {
    if (!properties) properties = {};
    var session = {};

    var apiApp = await apiTestUtils.createFakeApp();

    var app = new application({
      test: {
      },
      apiApp: apiApp,
      element: document.createElement("div"),
      bus: new AttachDefaultsBus({ public: true, session: session }, apiApp.bus),
      debug: true,
      config: {
        beta: false,
        log: {
          level: 0
        },
        db: {
          type: "mock"
        },
        email: {
          type: "mock"
        },
        hosts: {
          browser: "0.0.0.0:8080"
        }
      }
    });

    await app.initialize();

    app.test.fixtures = await fixtures.create(app);
    app.router.redirect("/logout");

    app.testUtils = {

      login: function(user) {
        app.router.redirect("logout");
        app.router.redirect("login");
        app.element.querySelector("*[name='emailAddress']").value    = user.emailAddress.valueOf();
        app.element.querySelector("*[name='password']").value = user.password.valueOf();
        React.addons.TestUtils.Simulate.change(app.element.querySelector("*[name='emailAddress']"));
        React.addons.TestUtils.Simulate.change(app.element.querySelector("*[name='password']"));
        React.addons.TestUtils.Simulate.submit(app.element.querySelector("form"));
      },

      setInputValue: function(query, value) {
        app.element.querySelector(query).value = value;
        React.addons.TestUtils.Simulate.change(app.element.querySelector(query));
      }

    };

    return app;
  }
};