import expect            from "expect.js";
import RequestInviteForm from "common/data/forms/request-invite";
import SignupForm        from "common/data/forms/signup"
import testUtils         from "api/test/utils";

describe(__filename + "#", function() {

  var apiApp;

  beforeEach(async function() {
    apiApp = await testUtils.createFakeApp();
  });

  afterEach(function() {

  });


  it("cannot request an invite if the email exists as a user", async function() {

    var signupForm = new SignupForm({
      bus: apiApp.bus,
      name: "bob",
      emailAddress: "a@b.com",
      password: "password"
    });

    await signupForm.submit();

    var requestInviteForm = new RequestInviteForm({
      bus: apiApp.bus,
      name: "bob",
      emailAddress: "a@b.com"
    });

    var err;

    try {
      await requestInviteForm.submit();
    } catch(e) {
      err = e;
    }

    expect(err.message).to.be("userEmailAddressExists");
    expect(err.statusCode).to.be(409);
  });

  it("returns the same invitee object if the email exists", async function() {
    var requestInviteForm = new RequestInviteForm({
      bus: apiApp.bus,
      name: "bob",
      emailAddress: "a@b.com"
    });

    var err;
    var invitee = await requestInviteForm.submit();
    var inviteeb = await requestInviteForm.submit();

    expect(invitee._id.valueOf()).to.be(inviteeb._id.valueOf());
  });

  xit("cannot request an invite an invitee already exists");
  xit("prioritizes users who have invited more people");
});
