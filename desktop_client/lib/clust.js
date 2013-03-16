var cluster = require("cluster"),
_ = require("underscore");

var startSlave  = function() {
  require("./index");
}

var startMaster = _.throttle(function() {
  cluster.fork().once("exit", startMaster);
}, 500);


if(cluster.isMaster) {
  startMaster();
} else {
  startSlave();
}