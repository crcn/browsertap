import sift              from 'sift';
import httperr           from 'httperr';
import CommandBus        from 'common/mesh/bus/command';
import Invitee           from 'common/data/models/invitee';
import User              from 'common/data/models/user';
import RequestInviteForm from 'common/data/forms/request-invite';
import crc32             from 'crc32';

export default function(app, bus) {

  var browserHost = app.get('config.hosts.browser');

  async function generateShortCode() {
    var code;
    do {
      code = crc32(String(Date.now()));
    } while(await Invitee.findOne(bus, { shortcode: code }));
    return code;
  }

  return {

    /**
     */

    requestInvite: CommandBus.create({
      execute: async function(operation) {
        var form = new RequestInviteForm(Object.assign({ bus: bus }, operation.data));

        if (await User.findOne(bus, { emailAddress: form.emailAddress.valueOf() })) {
          throw new httperr.Conflict('userEmailAddressExists');
        }

        var invitee;
        var inviter;

        // return invitee based on email address. Don't want to lock them out
        // from seeing the secondary page which allows them to invite people.
        if (!(invitee = await Invitee.findOne(bus, { emailAddress: form.emailAddress.valueOf() }))) {

          // reward them
          if (form.inviterShortcode) {
            inviter = await Invitee.findOne(bus, { shortcode: form.inviterShortcode.valueOf() });
            if (inviter) {
              inviter.inviteCount++;
              await inviter.update();
            }
          }

          var invitee = new Invitee(Object.assign({ }, form, {
            inviter   : inviter,
            shortcode : await generateShortCode()
          }));

          await invitee.insert();
        }


        return invitee;
      }
    }),

    /**
     */

    getInviteeFromShortCode: CommandBus.create({
      execute: async function(operation) {
        var invitee = await Invitee.findOne(bus, { shortcode: operation.shortcode });
        if (!invitee) throw new httperr.NotFound('inviteeNotFound');
        return { name: invitee.name };
      }
    })
  };
};
