import ConfirmAccountForm from "./confirm-account"
import ForgotPassword     from "./forgot-password"
import User               from "common/data/models/user"

export default {

  /**
   */

  getSessionUser: function*(bus) {
    return new User(Object.assign({ bus: bus }, (yield bus.execute({ name: "getSessionUser" }).read()).value));
  },

  /**
   */

  confirmAccount: function*(bus, token) {
    return yield (new ConfirmAccountForm(Object.assign({ bus: bus, token: token }))).submit();
  },

  /**
   */

  logout: function*(bus) {
    return (yield bus.execute({ name: "logout" }).read()).value;
  }
};
