import DataCollection from '../collection';
import DataObject from '../object';
import mergeCollection from 'common/utils/collection/merge';

class ModelCollection extends DataCollection {


  /**
   */

  constructor(properties) {
    super(properties);
    if (!this.modelClass) this.modelClass = DataObject;
    if (!this.source) this.source = [];
    this._watchSource();
  }

  /**
   */

  createModel(properties) {
    return new this.modelClass(properties);
  }

  /**
   */

  setProperties(properties) {
    super.setProperties(properties);
    if (properties.source) {
      this._watchSource();
    }
  }

  /**
   */

  getSourceCollection() {
    if (this._sourceCollection) return this._sourceCollection;

    this._sourceCollection = new DataCollection({
      target: this.source
    });

    this._sourceCollection.watch((changes) => {
      this._syncSource();
    });

    return this._sourceCollection;
  }

  /**
   */

  _watchSource() {
    if (this._sourceWatcher) this._sourceWatcher.dispose();
    this._sourceWatcher = void 0;
    if (this.source.watch) {
      this._sourceWatcher = this.source.watch((changes) => {
        this._syncSource();
      });
    }
    this._syncSource();
  }

  /**
   */

  _syncSource() {
    var target        = [];

    var target = mergeCollection(this.target, this.source, {
      cast: (sourceData) => {
        return this.createModel({ source: sourceData });
      },
      update: (a, b) => {
        a.setProperties({ source: b.source });
      },
      equals: (a, b) => {
        return a.source._id == b.source._id;
      },
      remove: (a) => {
        if (a.dispose) a.dispose();
      }
    });

    this.setProperties({
      target: target,
      length: target.length
    });
  }
};

export default ModelCollection;
