module.exports = function(object, property, newFn) {
	var oldFn = object[property];
	object[property] = function() {
		newFn.apply(object, arguments);
		if(oldFn) {
			oldFn.apply(object, arguments);
		}
	}
}