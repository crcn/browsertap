import DataCollection from '../collection';

class ModelCollection extends DataCollection {

  /**
   */

  modelClass = Object


  /**
   */

  constructor(properties) {
    super(properties);
    if (!this.source) this.source = [];
    this._update();
  }

  /**
   */

  createModel(properties) {
    return new this.modelClass(properties);
  }

  /**
   */

  getSourceCollection() {

  }

  /**
   */

  _update() {
    var target        = [];
    var _newModelDict = {};
    var _oldModelDict = this._dict || {};

    for (var i = 0, n = this.source.length; i < n; i++) {
      var sourceData = this.source[i];
      var _id        = sourceData._id;
      var model;

      if (model = _oldModelDict[_id]) {
        model.setProperties({ data: sourceData });
      } else {
        model = this.createModel({ source: sourceData });
      }

      _newModelDict[_id] = model;
      target.push(model);
    }

    this.target = target;
    this.length = this.target.length;
  }
};

export default ModelCollection;
