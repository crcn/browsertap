import httperr from "httperr";
import User from "common/data/models/user";
import { Bus, AsyncResponse }  from "mesh";

class CommandBus extends Bus {
  constructor({ auth, execute }) {
    super();
    this._auth    = auth;
    this._execute = execute;
  }
  execute(operation) {
    return new AsyncResponse(async function(writable) {

      if (this._auth === true) {
        if (!operation.session.userId) {
          return writable.error(new httperr.Unauthorized("must be logged in for this"));
        }

        operation.user = await User.findOne(operation.app.bus, { _id: String(operation.session.userId) });
      }

      try {
        writable.end(await this._execute(operation));
      } catch(e) {
        writable.error(e);
      }
    }.bind(this));
  }
}

export default CommandBus;
