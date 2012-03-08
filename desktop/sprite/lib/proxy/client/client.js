(function() {
  var EventEmitter, URL, client, debounce, em, host, listen, location, port, tapFunction, throttle, watchLocation;

  EventEmitter = require("events").EventEmitter;

  URL = require("url");

  if (window.top !== window.self) return;

  host = 'localhost';

  port = 8089;

  /*
  */

  tapFunction = function(object, property, newFn) {
    var oldFn;
    oldFn = object[property];
    return object[property] = function() {
      newFn.apply(object, arguments);
      if (oldFn) return oldFn.apply(object, arguments);
    };
  };

  /*
  */

  debounce = function(fn, delay) {
    var onTimeout, timeout;
    timeout = null;
    onTimeout = function() {
      return fn.apply(this, arguments);
    };
    return function() {
      clearTimeout(timeout);
      return timeout = setTimeout(onTimeout, delay);
    };
  };

  /*
  */

  throttle = function(fn, delay) {
    var onTimeout, running;
    running = false;
    onTimeout = function() {
      running = false;
      return fn.apply(this, arguments);
    };
    return function() {
      if (running) return false;
      running = true;
      return setTimeout(onTimeout, delay);
    };
  };

  /*
  */

  location = function() {
    return URL.parse(window.location.href, true);
  };

  /*
  */

  em = new EventEmitter();

  client = DNode({
    title: document.title,
    location: location(),
    history: {
      back: function() {
        return history.back();
      },
      forward: function() {
        return history.forward();
      },
      go: function(index) {
        return history.go(index);
      }
    },
    setLocation: function(url) {
      return window.location = url;
    },
    on: function(type, callback) {
      return em.addListener(type, callback);
    },
    emit: function() {
      return em.emit.apply(em, arguments);
    }
  });

  /*
   listens for an event to fire on a dom object
  */

  listen = function(target, events) {
    var event, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = events.length; _i < _len; _i++) {
      event = events[_i];
      _results.push((function(event) {
        return tapFunction(target, event, function(arg1) {
          return em.emit(event, arg1);
        });
      })(event));
    }
    return _results;
  };

  /*
   watches for the top url to change
  */

  watchLocation = function() {
    var currentHRef;
    currentHRef = window.location.href;
    return setInterval(function() {
      var newLoc;
      newLoc = location().href;
      if (currentHRef === newLoc) return;
      console.log("location change");
      currentHRef = newLoc;
      return em.emit("locationChange", location());
    }, 500);
  };

  tapFunction(document, "onready", function() {
    return bridge.emit("documentready");
  });

  tapFunction(document, "onmousemove", throttle(function() {
    return em.emit("mousemove");
  }, 1000));

  watchLocation();

  client.connect(port, host);

}).call(this);
