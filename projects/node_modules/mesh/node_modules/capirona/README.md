### JavaScript Build System

This is the build system used for [mesh](/crcn/mesh).

### Example make.json file:

```javascript
{
	"tasks": {
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

```javascript
var capirona = require('capirona');

capirona.make().load('/path/to/make.json').run('web:debug:hello', { name: 'craig' }, function(err) {
	if(err) return console.error(err.message);
	console.log('done without errors')
});
```

### API

#### .make() 

Creates a new make object

#### .load(source)

Loads the source of an object. Can be a `string`, or `object`.

### .run(tasks[, args], callback)

Runs the loaded task

### Syntax

