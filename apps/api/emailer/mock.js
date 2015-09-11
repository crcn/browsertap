
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
    return Promise.resolve();
  }
}

/**
 */

export default function(app) {
  return new MockMailer();
}