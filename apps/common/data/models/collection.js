import DataCollection from '../collection';
import DataObject from '../object';

class ModelCollection extends DataCollection {


  /**
   */

  constructor(properties) {
    super(properties);
    if (!this.modelClass) this.modelClass = DataObject;
    if (!this.source) this.source = [];
    this._syncSource();
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
      if (this._sourceCollection) {
        this._sourceCollection.setProperties({ target: properties.source });
      } else {
        this._syncSource();
      }
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

  _syncSource() {
    var target        = [];
    var _newModelDict = {};
    var _oldModelDict = this._modelDict || {};

    for (var i = 0, n = this.source.length; i < n; i++) {
      var sourceData = this.source[i];
      var _id        = sourceData._id;
      var model;

      if (model = _oldModelDict[_id]) {
        model.setProperties({ source: sourceData });
      } else {
        model = this.createModel({ source: sourceData });
      }

      _newModelDict[_id] = model;
      target.push(model);
    }

    for (var _id in _oldModelDict) {
      if (_newModelDict[_id] == void 0) {
        var oldModel = _oldModelDict[_id];
        if (oldModel.dispose) oldModel.dispose();
      }
    }

    this._modelDict = _newModelDict;

    this.setProperties({
      target: target,
      length: target.length
    });
  }
};

export default ModelCollection;
