var getConfig   = require('common/utils/get-config');
var deepExtend  = require('lodash/object/defaultsDeep');

module.exports = function(env) {

  var config = {
    defaults: {
      beta: true,
      api: {
        host: 'http://0.0.0.0:8080'
      },
      mdns: {
        browse: ['machine'],
        port: 9000
      }
    },
    staging: {
      api: {
        host: 'http://staging.browsertap.com/api'
      }
    }
  };


  return deepExtend({}, config.defaults, getConfig(env));
};
