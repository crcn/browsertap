(function() {
  var EventEmitter;

  EventEmitter = require("events").EventEmitter;

  module.exports = function() {
    var currentWindow;
    currentWindow = null;
    return function(remote, con) {
      return remote.on("mousemove", function() {
        if (currentWindow && currentWindow !== remote) {
          currentWindow.isFocus = false;
        }
        if (!remote.isFocus) remote.emit("focus");
        remote.isFocus = true;
        return currentWindow = remote;
      });
    };
  };

}).call(this);
