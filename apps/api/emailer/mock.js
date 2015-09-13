
/**
 */

class Outbox {
  constructor() {
    this.clear();
  }
  clear() {
    this.messages = [];
  }
}

/**
 */

class MockMailer {
  constructor(app) {
    this.app = app;
    this.outbox = new Outbox();
  }

  // @params(EmailForm)
  send(email) {
    this.outbox.messages.push(email);
    this.app.logger.info("email", email);
    return Promise.resolve();
  }
}

/**
 */

export default function(app) {
  return new MockMailer(app);
}