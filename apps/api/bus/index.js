import { Bus, WrapBus, NoopBus, CatchErrorBus } from 'mesh';

import InternalCommandsBus from './internal-commands';
import PublicCommandsBus from './public-commands';
import DbBus from './db';
import LogBus from 'common/mesh/bus/log';


export default {
  create: function(app, bus) {

    if (!bus) bus = NoopBus.create();
    bus = DbBus.create(app, bus);
    bus = InternalCommandsBus.create(app, bus);
    bus = PublicCommandsBus.create(app, bus);
    bus = CatchErrorBus.create(bus, function(error) {
      app.logger.error(error);
      throw error;
    });

    return bus;
  }
};
