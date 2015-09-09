
/**
 */

class Outbox {
  constructor() {
    this.messages = [];
  }
}

/**
 */

class MockMailer {
  constructor() {
    this.outbox = new Outbox();
  }

  // @params(EmailForm)
  send(email) {
    this.outbox.messages.push(email);
  }
}

/**
 */

export default function(app) {
  app.emailer = new MockMailer();
}