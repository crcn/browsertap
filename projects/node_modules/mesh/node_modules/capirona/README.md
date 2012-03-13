### JavaScript Build System

This is the build system used for [mesh](/crcn/mesh).

### Example make.json file:

```javascript
{
	"commands": {
		"web": {
			"say/hello -> debug/:task": {
				"log": "make <%=task %>"
			}
		},
		"say/hello": {
			"log": "hello world!"
		}
	}
}	
```

### Usage


A raw make config:

```javascript
var capirona = require('capirona');


capirona.make({
	"commands": {
		"hello/:name": {
			"log": "hello <%-name %>!"
		}
	}	
},
"<%-command %>").run({ command: 'hello:craig' }, function(err, result) {
	
});

```



### API

#### .make(config) 

Creates a new make object


### .run(target, callback)

Runs the loaded task

### Syntax

