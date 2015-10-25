import httperr from 'httperr';
import User from 'common/data/models/user';
import { Bus, Response }  from 'mesh';

class CommandBus extends Bus {
  constructor({ auth, execute }) {
    super();
    this._auth    = auth;
    this._execute = execute;
  }
  execute(operation) {
    return Response.create(async function(writable) {

      if (this._auth === true) {
        if (!operation.session.userId) {
          return writable.abort(new httperr.Unauthorized('must be logged in for this'));
        }

        operation.user = await User.findOne(operation.app.bus, { _id: String(operation.session.userId) });
      }

      try {
        writable.write(await this._execute(operation));
        writable.close();
      } catch(e) {
        writable.abort(e);
      }
    }.bind(this));
  }
}

export default CommandBus;
