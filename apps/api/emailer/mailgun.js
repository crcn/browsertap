import { Mailgun } from "mailgun";

/**
 */

class Emailer {

  /**
   */

  constructor(options) {
    this._mailer = new Mailgun(options.key);
  }
}

/**
 */

export default function(options) {
  return new Emailer(options);
};