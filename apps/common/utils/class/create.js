export default function() {
  var object = Object.create(this.prototype);
  this.apply(object, arguments);
  return object;
}
