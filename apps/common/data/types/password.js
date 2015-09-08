import passwordHash from "password-hash"
import ValueType    from "./value"
/**
 */

class Password extends ValueType {
  validate(value) {
    return /.{5,}/.test(value);
  }
  hash() {
    return new Password(passwordHash.generate(this.value));
  }
  verify(value) {
    return passwordHash.verify(value.valueOf(), this.value);
  }
}

/**
 */

export default Password;