import APIApplication from '../../application';
import merge from 'lodash/object/merge';
import { AttachDefaultsBus } from 'mesh';

module.exports = {
  createFakeApp: async function(properties) {
    if (!properties) properties = {};

    var app = new APIApplication(merge({
      debug: true,
      session: {},
      config: {
        beta: false,
        log: {
          level: 0
        },
        redis: {
          host: 'localhost'
        },
        hosts: {
          browser: '//browser'
        },
        db: {
          type: 'mock'
        },
        stripe: {
          mock: true
        },
        emailer: {
          service: 'mock'
        }
      }
    }, properties));

    await app.initialize();

    app.bus = AttachDefaultsBus.create({ app: app, session: app.session }, app.bus);

    return app;
  }
};
