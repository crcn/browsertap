Ember.Binding.fn = function(target, fn, binding) {

	var listener = {
		onEvent: function() {
			target[fn](target.get(binding));
		}
	}

	target.addObserver(binding, listener, "onEvent");
	if(target.get(binding) !== undefined) {
		listener.onEvent();
	}
}