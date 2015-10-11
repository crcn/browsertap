import testUtils from "desktop-client/test/utils";
import expect from "expect.js"


describe(__filename + "#", function() {
  var app;

  beforeEach(async function() {
    app = await testUtils.createFakeApp();
  });

  it("open up a window with a custom width & height", async function() {

    var win;

    app.classes.browserWindowClass = function(properties) {
      win = this;
      Object.assign(this, properties);
      this.loadUrl = function(url) {
        this.url = url;
      }
    }

    await app.bus.execute({ name: "openWindow", width: 100, height: 100 }).read();
    await testUtils.timeout(0);
    expect(win.width).to.be(100);
    expect(win.height).to.be(100);
    expect(win.url).to.contain("componentName%22%3A%22main%22%7D");
  });

  it("can open a window with a custom component", async function() {
    var win;

    app.classes.browserWindowClass = function() {
      win = this;
      this.loadUrl = function(url) {
        this.url = url;
      }
    }

    await app.bus.execute({ name: "openWindow", width: 100, height: 100, componentName: "test" }).read();
    await testUtils.timeout(0);
    expect(win.url).to.contain("componentName%22%3A%22test%22%7D");
  });
});
