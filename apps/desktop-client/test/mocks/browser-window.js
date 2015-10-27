import Mock from './mock';

class BrowserWindowMock extends Mock {
  constructor(properties) {
    super();
    Object.assign(this, properties);
  }
  loadUrl(windowPath, options) {

  }
}

export default BrowserWindowMock;
