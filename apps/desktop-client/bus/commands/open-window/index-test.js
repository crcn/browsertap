import testUtils from 'desktop-client/test/utils';
import expect from 'expect.js'


describe(__filename + '#', function() {
  var app;

  beforeEach(async function() {
    app = await testUtils.createFakeApp();
  });

  xit('open up a window with a custom width & height', async function() {

    var win;

    app.classes.browserWindowClass = function(properties) {
      win = this;
      Object.assign(this, properties);
      this.loadUrl = function(url) {
        this.url = url;
      }
    }

    await app.bus.execute({ action: 'openWindow', width: 100, height: 100 });
    await testUtils.timeout(10);
    expect(win.width).to.be(100);
    expect(win.height).to.be(100);
    expect(win.url).to.contain('componentName%22%3A%22main%22%7D');
  });

  xit('can open a window with a custom component', async function() {
    var win;

    app.classes.browserWindowClass = function() {
      win = this;
      this.loadUrl = function(url) {
        this.url = url;
      }
    }

    await app.bus.execute({ action: 'openWindow', width: 100, height: 100, componentName: 'test' }).read();
    await testUtils.timeout(0);
    expect(win.url).to.contain('componentName%22%3A%22test%22%7D');
  });
});
