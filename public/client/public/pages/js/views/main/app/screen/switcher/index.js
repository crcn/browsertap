// Generated by CoffeeScript 1.6.3
var SwitcherView, mojo, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mojo = require("mojojs");

SwitcherView = (function(_super) {
  __extends(SwitcherView, _super);

  function SwitcherView() {
    _ref = SwitcherView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  /*
  */


  SwitcherView.prototype.define = ["visible"];

  /*
  */


  SwitcherView.prototype.paper = require("./index.pc");

  /*
  */


  SwitcherView.prototype.bindings = {
    "models.platform": "sections.platforms.model",
    "visible": function(value) {
      var $self;
      $self = $(".screen-switcher-outer");
      if (value) {
        return $self.transit({
          opacity: 1
        });
      } else {
        return $self.transit({
          opacity: 0
        });
      }
    }
  };

  /*
  */


  SwitcherView.prototype.sections = {
    platforms: require("./column")
  };

  return SwitcherView;

})(mojo.View);

module.exports = SwitcherView;

