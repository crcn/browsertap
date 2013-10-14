// Generated by CoffeeScript 1.6.3
var MenuView, mojo, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mojo = require("mojojs");

MenuView = (function(_super) {
  __extends(MenuView, _super);

  function MenuView() {
    _ref = MenuView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  /*
  */


  MenuView.prototype.position = 0;

  /*
  */


  MenuView.prototype.paper = require("./index.pc");

  /*
  */


  MenuView.prototype.bindings = {
    "models.settings.menuPosition": "position",
    "models.browser.name": "label"
  };

  /*
  */


  MenuView.prototype.nextPosition = function() {
    if (this.position === 3) {
      this.position = -1;
    }
    return this.set("models.settings.menuPosition", this.position + 1);
  };

  return MenuView;

})(mojo.View);

module.exports = MenuView;
