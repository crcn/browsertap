// Generated by CoffeeScript 1.6.3
var MainView, mojo, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mojo = require("mojojs");

MainView = (function(_super) {
  __extends(MainView, _super);

  function MainView() {
    _ref = MainView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  /*
  */


  MainView.prototype.paper = require("./index.pc");

  /*
  */


  MainView.prototype.sections = {
    main: {
      type: "states",
      index: 1,
      views: [
        {
          "class": require("./auth"),
          name: "auth"
        }, {
          "class": require("./app"),
          name: "app"
        }
      ]
    }
  };

  return MainView;

})(mojo.View);

module.exports = MainView;

