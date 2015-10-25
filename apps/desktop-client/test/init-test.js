var mockery = require('mockery');

mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false
});

mockery.registerMock('browser-window', require('./mocks/browser-window'));
mockery.registerMock('ipc', require('./mocks/ipc'));
// mockery.registerMock('common/mesh/bus/websocket', require('./mocks/websocket-bus'));
