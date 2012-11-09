replacement for sprite. The puppet exposes API for the following activities:

1. launching browser apps
2. controlling mouse & keyboard
3. broadcasting to the rtmp server


Example

```javascript

var puppet = require("puppet").create({
	browsers: {
		directory: "pathToAllBrowsers",
		cache: {
			root: "PathToRoot",
			directorys: {
				'firefox': "PathToDir"
			}
		},
		processNames: {
			"firefox": ["firefox*"]
		},
		padding: {
			"firefox": {
				19: {
					top: 100
				}
			}
		}
	}
});

puppet.browsers.open()


puppet.listen(8083, function(err, server) {
		
	server.browsers.open({ type: "chrome", version: "9" }, function(err, browser) {
		browser.getTitle(function(err, title) {

		});

	});

	server.desktop.resize()
});


puppet.browsers.open({ type: "chrome", version: ""})

```

### API

#### .desktop.resize(width, height)

resizes the desktop to given dims (resizes all windows actually)

#### .keyboard.sendEvent()

sends a keyboard event

#### .mouse.sendEvent()

sends a mouse event

### Browser API

#### .takePicture(callback)

takes picture of the current browser

#### .getTitle()

Returns the current title of the 

#### .getFavIcon()

#### .location.get(fn)

Returns the current location of the browser

#### .location.set(fn)

sets the location

#### .location.back()

Moves the current location back

#### .location.forward()

Moves the location forward

#### .location.on(event, callback)

Listens for any events emitted by the location

Events:
	`change` - emitted when the location changes


