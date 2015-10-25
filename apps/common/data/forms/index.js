import ConfirmAccountForm from './confirm-account'
import ForgotPassword     from './forgot-password'
import User               from 'common/data/models/user'

export default {

  /**
   */

  getSessionUser: async function(bus) {
    return new User(Object.assign({ bus: bus }, (await bus.execute({ action: 'getSessionUser' }).read()).value));
  },

  /**
   */

  confirmAccount: function(bus, token) {
    return (new ConfirmAccountForm(Object.assign({ bus: bus, token: token }))).submit();
  },

  /**
   */

  logout: async function(bus) {
    return (await bus.execute({ action: 'logout' }).read()).value;
  }
};
