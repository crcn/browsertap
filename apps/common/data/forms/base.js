import DataObject from '../object';

class Form extends DataObject {

  /**
   */

  constructor(name, schema, properties, modelClass) {
    if (properties) properties = schema.coerce(properties, true);
    super(properties);
    this.schema      = schema;
    this._name       = name;
    this._modelClass = modelClass;
  }

  /**
   */

  setProperties(properties) {
    super.setProperties(this.schema.coerce(properties, true));
  }

  /**
   */

  async submit() {

    var data = (await this.bus.execute({
      action: this._name,
      data: this
    }).read()).value;

    if (this._modelClass != void 0) {
      return new this._modelClass(Object.assign({ bus: this.bus }, data));
    }

    return data;
  }
}

export default Form;
