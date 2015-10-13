import nodemailer from "nodemailer";
import httperr from "httperr";

/**
 */

class Emailer {

  /**
   */

  constructor(app, options) {
    this.app = app;
    this.from = options.from;
    this._transporter = nodemailer.createTransport(options);
  }

  /**
   */
   
  send(form) {

    var options = form.toJSON();

    return new Promise(function(resolve, reject) {

      // send mail with defined transport object
      this._transporter.sendMail({
        to      : options.to,
        from    : this.from,
        subject : options.subject,
        html    : options.body
      }, function(error, info){
          if(error) {
            this.app.logger.error(err.stack);
           return reject(new httperr[500]("couldNotSendEmail"));
          }
          resolve(info);

      }.bind(this));
    }.bind(this));
  }
}

export default function(app, options) {
  return new Emailer(app, options);
};
