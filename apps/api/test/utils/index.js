import APIApplication from "../../application";
import merge from "lodash/object/merge";
import { AttachDefaultsBus } from "mesh";

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
        db: {
          type: "mock"
        },
        emailer: {
          service: "mock"
        }
      }
    }, properties));

    await app.initialize();

    app.bus = new AttachDefaultsBus({ app: app, session: app.session }, app.bus);

    return app;
  }
};
