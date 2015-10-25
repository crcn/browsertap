import sendgrid from 'sendgrid';
import httperr  from 'httperr';

/**
 */

class Emailer {

  /**
   */

  constructor(app, options) {
    this.app = app;
    Object.assign(this, options);
    this._sg = sendgrid(options.key);
  }

  /**
   */

  send(form) {

    var options = form.toJSON();

    var email = new this._sg.Email({
      to      : options.to,
      from    : this.from,
      subject : options.subject,
      html    : options.body
    });

    return new Promise(function(resolve, reject) {
      this._sg.send(email, function(err, response) {
        if (err) {
          this.app.logger.error(err.stack);
          return reject(new httperr[500]('couldNotSendEmail'));
        }
        resolve();
      }.bind(this));
    }.bind(this));
  }
}

/**
 */

export default function(app, options) {
  return new Emailer(app, options);
};
