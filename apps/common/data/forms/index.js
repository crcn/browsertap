import ConfirmAccountForm from "./confirm-account"
import ForgotPassword     from "./forgot-password"

export default {

  /**
   */

  getSessionUser: function*(bus) {
    return yield bus({ name: "getSessionUser" });
  },

  /**
   */

  confirmAccount: function*(bus, token) {
    return yield (new ConfirmAccountForm(Object.assign({ bus: bus, token: token }))).submit();
  }
};
