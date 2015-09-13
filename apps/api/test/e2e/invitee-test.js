import expect            from "expect.js";
import RequestInviteForm from "common/data/forms/request-invite";
import SignupForm        from "common/data/forms/signup"
import co                from "co"

describe(__filename + "#", function() {
  it("cannot request an invite if the email exists as a user", co.wrap(function*() {

    var signupForm = new SignupForm({
      bus: apiApp.bus,
      emailAddress: "a@b.com",
      password: "password"
    });

    yield signupForm.submit();


    var requestInviteForm = new RequestInviteForm({
      bus: apiApp.bus,
      emailAddress: "a@b.com"
    });

    var err;

    try {
      yield requestInviteForm.submit();
    } catch(e) {
      err = e;
    }

    expect(err.statusCode).to.be(409);
    expect(err.message).to.be("userEmailAddressExists");
  }));

  it("cannot request an invite if the user already entered in an email", co.wrap(function*() {
    var requestInviteForm = new RequestInviteForm({
      bus: apiApp.bus,
      emailAddress: "a@b.com"
    });

    var err;
    yield requestInviteForm.submit();

    try {
      yield requestInviteForm.submit();
    } catch(e) {
      err = e;
    }

    expect(err.statusCode).to.be(409);
    expect(err.message).to.be("inviteeExists");
  }));

  xit("cannot request an invite an invitee already exists");
  xit("prioritizes users who have invited more people");
});
