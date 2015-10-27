var mockery = require('mockery');

mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false
});

var mock = {
  'browser-window': require('./mocks/browser-window'),
  'ipc': require('./mocks/ipc')
};


for (var moduleName in mock) {
  var mv = mock[moduleName];
  mockery.registerMock(moduleName, mv);
}

beforeEach(function() {
  for (var moduleName in mock) {
    mock[moduleName].resetMock();
  }
});
