
kango.ui.browserButton.addEventListener(kango.ui.browserButton.event.COMMAND, function(event) {
	dispatchActive("openVM");
});


function dispatchActive(type) {
	kango.browser.tabs.getAll(function(tabs) {
		for(var i = tabs.length; i--;) {
			var tab = tabs[i];
			if(tab.isActive()) {
				tab.dispatchMessage(type);
				break;
			}
		}
	});
}


kango.browser.addEventListener(kango.browser.event.TAB_CHANGED, function(event) {
	dispatchActive("tabChanged");
});


kango.addMessageListener("openWindow", function(event) {
	//TODO - check sec
	event.data.left = 200;
	event.data.top = 200;
	var win = kango.browser.windows.create(event.data);
})
