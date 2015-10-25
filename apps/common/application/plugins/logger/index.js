import Logger from 'common/logger';
import extend from 'lodash/object/extend';

/**
 */

module.exports = function(app) {
  var config = extend({ bus: app.bus }, app.get('config.log'));
  app.logger = new Logger(config);
};
