var React  = require("react/addons");
var expect = require("expect.js");

var utils = {

  login: function*(user) {
    browserApp.router.redirect("logout");
    browserApp.router.redirect("login");
    browserApp.element.querySelector("*[name='emailAddress']").value    = user.emailAddress.valueOf();
    browserApp.element.querySelector("*[name='password']").value = user.password.valueOf();
    React.addons.TestUtils.Simulate.change(browserApp.element.querySelector("*[name='emailAddress']"));
    React.addons.TestUtils.Simulate.change(browserApp.element.querySelector("*[name='password']"));
    React.addons.TestUtils.Simulate.submit(browserApp.element.querySelector("form"));
  },

  setInputValue: function(query, value) {
    browserApp.element.querySelector(query).value = value;
    React.addons.TestUtils.Simulate.change(browserApp.element.querySelector(query));
  }
};

export default utils;