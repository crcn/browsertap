// Generated by CoffeeScript 1.6.3
var PaymentView, mojo, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mojo = require("mojojs");

PaymentView = (function(_super) {
  __extends(PaymentView, _super);

  function PaymentView() {
    _ref = PaymentView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  PaymentView.prototype.paper = require("./index.pc");

  return PaymentView;

})(mojo.View);

module.exports = PaymentView;
