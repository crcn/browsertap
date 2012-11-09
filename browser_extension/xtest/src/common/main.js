
kango.ui.browserButton.addEventListener(kango.ui.browserButton.event.COMMAND, function(event) {
	kango.browser.tabs.getAll(function(tabs) {
		for(var i = tabs.length; i--;) {
			var tab = tabs[i];
			if(tab.isActive()) {
				tab.dispatchMessage("openVM");
				break;
			}
		}
	});
});


kango.browser.addEventListener(kango.browser.event.TAB_CHANGED, function(event) {
	event.target.dispatchMessage("refresh");
});
