
var __getters = {};

function get(target, keypath) {
  var getter;
  if (!(getter = __getters[keypath])) {
    getter = __getters[keypath] = new Function("target", "try { return target." + keypath + "} catch(e){}");
  }
  return getter(target);
}

module.exports = get;
