// Generated by CoffeeScript 1.6.3
var __slice = [].slice;

module.exports = function(mediator) {
  return mediator.on("load", function() {
    var next, options, _i;
    options = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), next = arguments[_i++];
    {
      console.log("loading application")
    }

    return next();
  });
};
