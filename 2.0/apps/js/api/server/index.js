var express = require("./express");
var socket  = require("./socket");

module.exports = function(app) {
  express(app);
  socket(app);
};
