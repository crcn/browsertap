import ValueType from "common/data/types/value";

class DesktopState extends ValueType {
  validate(value) {
    return /running|stopped|terminating|terminated/.test(value);
  }
}

export default DesktopState;