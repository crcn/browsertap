(function() {
  var host, request, stringifyqs, tapFunction;

  try {
    if (window.top.__sprite_client) return;
    window.top.__sprite_client = true;
  } catch (e) {
    return;
  }

  host = "http://{{host}}";

  /*
   taps a function
  */

  tapFunction = function(object, property, newFn) {
    var oldFn;
    oldFn = object[property];
    return object[property] = function() {
      newFn.apply(object, arguments);
      return oldFn.apply(object, arguments);
    };
  };

  /*
  */

  stringifyqs = function(json) {
    var hash, key;
    hash = [];
    for (key in json) {
      hash.push("" + key + "=" + (escape(json[key])));
    }
    if (hash.length) {
      return "?" + (hash.join("&"));
    } else {
      return "";
    }
  };

  /*
   sends a request to the server
  */

  request = function(path, json, callback) {
    var cbName, script;
    if (!json) json = {};
    json.cbName = cbName = "" + (Date.now()) + "_" + (Math.round(Math.random() * 9999999));
    window[cbName] = callback || function() {};
    script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "" + host + "/" + path + (stringifyqs(json));
    return document.body.appendChild(script);
  };

  /*
   emits an event back to the server
  */

  /*
  */

  tapFunction(document, "onready", function() {});

}).call(this);
