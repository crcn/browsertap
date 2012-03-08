## browser controller written in node.js inspired by selenium

## Features

- ability to auto-inject javascript into any html doc by proxying requests
- ability to invoke selenium-like commands

## Usage

```javascript

var sprite = require('sprite');


var inst = sprite.
create({
	directory: '~/browsers/directory'
}).
listen(8888);


inst.on('proxy', function(browserProxy) {

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

### .load(fn)

loads the controller

### .listen(port)

starts the proxy HTTP server

### .run(browserName)

starts the given browser

### .on(event, callback)

listens for an event

### .browser(browserName)

returns the browser instance


### Events

- `proxy` - called when a proxy is ready
- `browserOpen` - called when a browser is opened


## Proxy API

### .browser

the browser instance 

### .getTitle(fn)

### .getLocation(fn)

get the title

## Proxy Events

- `locationChange` - called when the location in the browser changes
- `end` - called when the browser is closed
- `load` - called when the body has completely loaded






