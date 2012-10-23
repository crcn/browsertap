module.exports = function(target) {

	return {
		browsers: {
			open: function(url, browser, callback) {
				target.browsers.killAll(function() {
					target.browsers.open(url, browser, function(err, proxy) {
						if(callback) {
							if(err) return callback(err);
							callback(null, wrapProxy(proxy));
						}
						target.desktop.resize();
					})
				})
			},
			getAll: function() {
				target.browsers.getAll.apply(target.browsers, arguments);
			}
		},
		desktop: {
			padding: function() {
				target.desktop.padding.apply(target.desktop, arguments);
			},
			resize: function() {
				target.desktop.resize.apply(target.desktop, arguments);
			},
			restart: function(options) {
				target.desktop.restart(options);
			},
			screenshot: {
				snapUrl: function() {
				var args = arguments;
					target.browsers.killAll(function() {
						target.desktop.screenshot.snapUrl.apply(target.desktop.screenshot, args);
					});
				},
				snap: function() {
					target.desktop.screenshot.snap.apply(target.desktop.screenshot, arguments);
				}
			}
		},
		keyboard: {
			sendEvent: function() {
				target.keyboard.sendEvent.apply(target.keyboard, arguments);
			}
		},
		mouse: {
			sendEvent: function() {
				target.mouse.sendEvent.apply(target.keyboard, arguments);
			}
		}
	};
}


function wrapProxy(target) {
	return target;
}