
module.exports = function(em/*, ...events*/) {
  var events = Array.prototype.slice.call(arguments, 1);
  return new Promise(function(resolve, reject) {
    events.forEach(function(event) {
      em.once(event, resolve);
    });
  });
};
