var doc = require('app');

require('babel/register')({
  optional: ['es7.classProperties', 'es7.decorators', 'es7.asyncFunctions']
});

var Application = require('./application');
var getConfig   = require('./get-config');

/**
 */

var app = global.app = new Application({
  config: getConfig({})
});

/**
 */

doc.on('ready', function() {
  app.initialize().then(function() {
    app.logger.info('initialized');
  });
});
