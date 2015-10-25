import mongo from 'mesh-mongodb';
import sift from 'sift';
import { ObjectId } from 'mongodb'
import { NodeStreamResponse } from 'mesh';
import traverse from 'traverse';

export default {
  create: function (app) {

    var host = app.get('config.db.host');
    app.logger.info('init mongo db: %s', host);

    var db = mongo(host);

    function _fixMongoids(data) {
      traverse(data).forEach(function(x) {
        if (this.key && ~this.key.indexOf('_id') && String(x).length === 24) {
          this.update(ObjectId(x));
        }
      });
    }

    return {
      execute: function(operation) {

        operation.action = operation.name;

        _fixMongoids(operation.data);
        _fixMongoids(operation.query);

        return NodeStreamResponse.create(db(operation));
      }
    };
  }
}
