import mixin from 'common/utils/class/mixin';
import httperr from 'httperr'
import readAll from 'common/mesh/utils/read-all';

export default function(collectionName) {

  var persistMixin = mixin({

    /**
    */

    constructor() {
      this.on('change', this._pOnChange);
      this._pOnChange({ properties: this });
    },

    /**
    */

    _pOnChange(changed) {
      if (changed.properties.data) {
        this.setProperties(this.deserialize(changed.properties.data));
      }
    },

    /**
    */

    deserialize() {
      // OVERRIDE ME
    },

    /**
    */

    load () {
      return this._run('load', {
        query: { _id: this._id }
      });
    },

    /**
    */

    remove () {
      return this._run('remove', {
        query: { _id: String(this._id) }
      });
    },

    /**
    */

    save() {
      return this._id ? this.update() : this.insert();
    },

    /**
    */

    insert() {
      return this._run('insert', {
        data : this.toJSON()
      });
    },

    /**
    */

    update() {
      return this._run('update', {
        data : this.toJSON(),
        query: { _id: String(this._id) }
      });
    },

    /**
    */

    fetch(operationName, properties) {
      return this.bus.execute(Object.assign({
        target     : this,
        action     : operationName,
        collection : collectionName
      }, properties));
    },

    /**
     */

    async _run(operationName, properties) {
      var {value} = (await this.fetch(operationName, properties).read());

      if (value) {
        this.setProperties(this.schema.coerce(Object.assign({}, this, value)));
      }

      return value;
    }
  });

  return function(clazz) {
    clazz = persistMixin(clazz);

    async function _find(multi, bus, query) {

      var response = bus.execute({
        action     : 'load',
        multi      : multi,
        query      : query,
        collection : collectionName
      });

      if (multi) {
        return (await readAll(response)).map(function(data) {
          return new clazz(Object.assign({ bus: bus }, data));
        })
      } else {
        var {value} = await response.read();
        if (value) return new clazz(Object.assign({ bus: bus }, value));
      }
    }

    clazz.find    = _find.bind(void 0, true);
    clazz.all     = function(bus) {
      return clazz.find(bus);
    };
    clazz.findOne = _find.bind(void 0, false);

    return clazz;
  }
};
