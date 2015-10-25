import DataCollection from '../collection';
import DataObject from '../object';

class ModelCollection extends DataCollection {

  /**
   */

  modelClass = DataObject


  /**
   */

  constructor(properties) {
    super(properties);
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
      this._syncSource();
    }
  }

  /**
   */

  getSourceCollection() {

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

    this._modelDict = _newModelDict;

    this.target = target;
    this.length = this.target.length;
  }
};

export default ModelCollection;
