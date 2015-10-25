require('common/babel-hooks');

var Application = require('./application');
var getConfig =  require('./get-config');

/**
 */

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

/**
 */

var app = new Application({
  config: getConfig(process.env)
});

/**
 */

app.initialize(function() {
  // app.logger.info('init'd');
});
