## browser controller written in node.js inspired by selenium

## Features

- ability to auto-inject javascript into any html doc by proxying requests
- ability to invoke selenium-like commands




## Setup

- set proxy to localhost:8888
- set lan settings to "bypass proxy server for local address"

## Usage

```javascript

var sprite = require('sprite');


var inst = sprite.
create({
	directory: '~/browsers/directory'
}).
listen(8888);


inst.on('browserProxy', function(browserProxy) {

	browserProxy.getTitle(function(title) {
		console.log(title);
	});


	browserProxy.on('locationChange', function(location) {

	});

});

inst.start('firefox 6', 'http://google.com');
```

## API

### .create(config)

starts the sprite instance with given config. the config consis

### .listen(port)

starts the proxy HTTP proxy server. Also enables the event `browserProxy`

### .start(browserName)

starts the given browser

### .on(event, callback)

listens for an event

### .browser(browserName)

returns the browser instance


### Events

- `proxy` - called when a proxy is ready
- `browserOpen` - called when a browser is opened
- `loaded` - called when the config files are loaded


## Proxy API

### .title

the title of the document

### .location

the current location

### .history.back()

hits back button for user

### .history.forward()

hits forward button for user

### .history.setLocation()

sets the location of the browser

## Proxy Events

- `locationChange` - called when the location in the browser changes
- `documentready` - called when the body has completely loaded
- `focus` - called when the user is focusing on this particular browser instance






