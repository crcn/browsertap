import sinon from 'sinon';

class Mock {

  constructor() {
    if (!this.constructor.references) {
      this.constructor.references = [];
    }
    this.constructor.references.push(this);

    Object.getOwnPropertyNames(this.__proto__).forEach((prop) => {
      this[prop] = sinon.spy(this, prop);
    });
  }

  static resetMock() {
    this.references = [];
  }
}

export default Mock;
