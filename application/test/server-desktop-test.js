request = require("request"),
expect = require("expect.js"),
config = require("../../config")(process.env.NODE_ENV);

describe("BrowserTap server", function() {

  var provisionHost = config.hosts.provision, token;

  it("can login to browsertap", function(next) {
    request.get("http://" + provisionHost + "/account.json", { json: true, qs: { email: "craig.j.condon@gmail.com", password: "tacofish" }}, function(err, response, body) {
      expect(body.result).not.to.be(undefined);
      expect(token = body.result.token).not.to.be(undefined);
      next();
    })
  });
});