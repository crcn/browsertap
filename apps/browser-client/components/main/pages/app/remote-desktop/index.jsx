var React           = require("react");
var Window          = require("./window");
import RemoteDesktop from "common/remote-desktop";
import throttle      from "lodash/function/throttle";
import co            from "co";

var RemoteDesktopComponent = React.createClass({
  getInitialState: function() {
    return {
      windows: []
    }
  },
  componentDidMount: function() {
    this._rd = new RemoteDesktop({
      host: "ws://localhost:9000"
    });
    co(this._initialize);
  },
  _initialize: function*() {
    this._onChange();
    var spy = this._rd.bus({ name: "spy" });

    var chunk;
    while (chunk = yield spy.read()) {
      if (!/load/.test(chunk.operation.name)) {
        chunk.response.then(this._onChange);
      }
    }
  },
  _onChange: throttle(function() {
    co(this._reload);
  }, 500),
  _reload: function*() {
    this.setState(yield this.getData());
  },
  getData: function*() {
    return {
      windows: yield this._rd.getWindows()
    };
  },
  render: function() {
    return <div className="m-remote-desktop">
      {
        (this.state.windows || []).map(function(win) {
          return <Window key={win.id} win={win} />
        })
      }
    </div>
  }
});

module.exports = RemoteDesktopComponent;
