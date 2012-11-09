var counter = 0;

kango.ui.browserButton.addEventListener(kango.ui.browserButton.event.Command, function(event) {
	var notification = kango.ui.notifications.createNotification('Title', 'Notification number ' + (++counter), 'http://kangoextensions.com/images/logos/kango.png');
	
	var x = 0;
	notification.addEventListener(notification.event.Click, function() {
		if(x == 2) {
			notification.close();
		}
		x++;
		kango.console.log('Notification click');
	});
	
	notification.addEventListener(notification.event.Show, function() {
		kango.console.log('Notification show');
	});
	
	notification.addEventListener(notification.event.Close, function() {
		kango.console.log('Notification close');
	});
	
	notification.show();
});