// Generated by CoffeeScript 1.6.3
var ColumnView, mojo, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mojo = require("mojojs");

ColumnView = (function(_super) {
  __extends(ColumnView, _super);

  function ColumnView() {
    this.selectOption = __bind(this.selectOption, this);
    _ref = ColumnView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  /*
  */


  ColumnView.prototype.define = ["openBrowserRequest"];

  /*
  */


  ColumnView.prototype.paper = require("./column.pc");

  /*
  */


  ColumnView.prototype.sections = {
    options: {
      type: "list",
      source: "model.options",
      modelViewClass: require("./option")
    }
  };

  /*
  */


  ColumnView.prototype._onRender = function() {
    return ColumnView.__super__._onRender.call(this);
  };

  /*
  */


  ColumnView.prototype.selectOption = function(option) {
    var _ref1;
    if ((_ref1 = this._selected) != null) {
      _ref1.deselect();
    }
    this._selected = option;
    this.set("openBrowserRequest", option.select());
    if (option.get("options.length")) {
      return this._addChild(option);
    }
  };

  /*
  */


  ColumnView.prototype._addChild = function(option) {
    if (this._child) {
      this._child.remove();
    }
    this._child = new ColumnView({
      model: option
    });
    this._child.render();
    return this.set("sections.child", this._child);
  };

  return ColumnView;

})(mojo.View);

module.exports = ColumnView;
