import sift from 'sift';
import { AcceptBus } from 'mesh';

var dbs = {
  mock  : require('./mock'),
  mongo : require('./mongo')
};

export default {
  create: function(app, bus) {
    var type = app.get('config.db.type');
    app.logger.info('init db: %s', type);

    if (!dbs[type]) {
      throw new Error('db transport ' + type + ' does not exist');
    }

    var busClass = dbs[type];

    var bus = AcceptBus.create(
      sift({ action: /insert|update|remove|load/ }),
      busClass.create(app),
      bus
    )

    return bus;
  }
};
