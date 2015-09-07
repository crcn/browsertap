import httperr from "httperr"

/**
 */

class ObjectType {

  /**
   */

  constructor(properties) {
    Object.assign(this, this.coerce(properties || {}));
  }

  /**
   */

  get fields() {
    return {};
  }

  /**
   */

  coerce(properties) {
    var newProps = {};

    for (var key in this.fields) {
      var fieldClass = this.fields[key];
      try {
        newProps[key] = new fieldClass(properties[key]);
      } catch(e) {
        if (e.statusCode === 400) throw new httperr.BadRequest(key + ".invalid");
        throw e;
      }
    }

    return newProps;
  }
}

/**
 */

export default ObjectType;
