import {EventEmitter} from 'events';
import DataObject from '../object';
import DataCollection from '../collection';
import ModelCollection from './collection';
import FilterThrough from 'common/mesh/stream/filter-through';
import CollectionBus from 'common/mesh/bus/collection';
import BusWriter from 'common/mesh/stream/bus-writer';
import sift from 'sift';

/**
* TODO: move persistence stuff over to here. BaseModel should extend DataTransferObject, or similar
*/

class BaseModel extends DataObject {

  /**
  */

  constructor(properties) {
    super(properties);
    this.schema = this.constructor.schema;
    if (properties && properties.source) {
      this._syncSource();
    }
  }

  /**
  */

  load () {
    return this._run('load', {
      query: { _id: this._id }
    });
  }

  /**
  */

  remove () {
    return this._run('remove', {
      query: { _id: String(this._id) }
    });
  }

  /**
  */

  save() {
    return this._run('upsert', {
      query: { _id: String(this._id) },
      data : this.toJSON()
    });
  }

  /**
  */

  insert() {
    return this._run('insert', {
      data : this.toJSON()
    });
  }

  /**
  */

  update() {
    return this._run('update', {
      data : this.toJSON(),
      query: { _id: String(this._id) }
    });
  }

  /**
  */

  fetch(operationName, properties) {
    return this.bus.execute(Object.assign({
      target     : this,
      action     : operationName,
      collection : this.constructor.collectionName
    }, properties));
  }

  /**
  */

  async _run(operationName, properties) {
    var {value} = (await this.fetch(operationName, properties).read());

    if (value) {
      this.setProperties({ source: value });
    }

    return value;
  }

  /**
  */

  toPublic() {
    return this.schema.serialize(this, false);
  }

  /**
  */

  toJSON() {
    return this.schema.serialize(this, true);
  }

  /**
  */

  setProperties(properties) {
    super.setProperties(properties);
    if (properties.source) this._syncSource();
  }

  /**
  */

  deserialize(source) {
    return source;
  }

  /**
  */

  _syncSource() {
    this.setProperties(
      this.schema.coerce(
        this.deserialize(this.source)
      )
    );
  }

  /**
  */


  static async _find(multi, bus, query, options) {

    if (!options) options = {};

    var response = bus.execute({
      action     : 'load',
      multi      : multi,
      query      : query,
      collection : this.collectionName
    });

    if (multi) {

      var source = new DataCollection({
        target: await response.readAll()
      });

      var collection = new ModelCollection({
        createModel : (properties) => new this(Object.assign({ bus: bus }, properties)),
        source      : source
      });

      if (options.tail) {
        bus.execute({ action: 'tail' })
        .pipeTo(FilterThrough.create((operation) => {
          if (operation.collection !== this.collectionName) {
            return false;
          }
          if (operation.action === 'insert') {
            return sift(query)(operation.data);
          }
          return true;
        }))
        .pipeTo(
          BusWriter.create(
            CollectionBus.create(
              source
            )
          )
        )
      }

      return collection;
    } else {
      var {value} = await response.read();
      if (value) return new this(Object.assign({ bus: bus }, { source: value }));
    }
  }

  static find(bus, query, options) {
    return this._find(true, bus, query, options);
  }

  static findOne(bus, query, options) {
    return this._find(false, bus, query, options);
  }

  static all(bus, options) {
    return this.find(bus, function() { return true; }, options);
  }
}

/**
*/

export default BaseModel;
