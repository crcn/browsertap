var fixtures = require("./fixtures");
var co       = require("co");

beforeEach(co.wrap(function*() {
  browserApp.test.fixtures = yield fixtures.create(browserApp);
  browserApp.router.redirect("logout");
}));
