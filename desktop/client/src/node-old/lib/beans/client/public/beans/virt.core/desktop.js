var remote;

exports.init = function(rm) {
	remote = rm;
	onResize();
}


var onResize = _.debounce(function() {
	if(!remote) return;
	remote.bridge.resize($(window).width(), $(window).height());
}, 500);

$(window).resize(onResize);