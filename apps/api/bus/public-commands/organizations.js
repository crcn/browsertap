import sift               from 'sift';
import httperr            from 'httperr';
import mu                 from 'mustache';
import fs                 from 'fs';
import CommandBus         from 'common/mesh/bus/command';
import cstripe            from 'stripe';
import Organization       from 'common/data/models/organization';

export default function(app, bus) {

  var browserHost = app.get('config.hosts.browser');

  return {

    /**
     */

    getUserOrganizations: CommandBus.create({
      auth: true,
      execute: async function(operation) {
        return await Organization.find(bus, {
          'access.user._id': operation.user._id.valueOf()
        });
      }
    })
  };
};
