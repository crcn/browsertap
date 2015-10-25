require('babel/register')({
  ignore:/common\/node_modules/,
  optional: ['es7.classProperties', 'es7.decorators']
});


var Application = require('./application');
var getConfig   = require('./get-config');

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
