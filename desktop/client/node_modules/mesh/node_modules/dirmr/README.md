## Merges directories together

## Motivation

- Used in [mesh](/crcn/mesh).
- Bootstrapping libraries
 

## Example

```javascript
var dirmr = require('dirmr'),
fs        = require("fs"),
mu        = require("mustache"),
tplData   = {};

dirmr().

//read the bootstrap directory for the target dirs
readdir(__dirname + "/src", /^(node|web)$/). 

//filter through template files, and fill them - examples are: .mu.html, .ejs.html, .mu.json
filterFile(dirmr.parseTemplate(tplData)).

//copy all the files to the library directory
join(__dirname + "/lib"). 

//called after all files have been copied
complete(function(err, result) {
	
});
```


## API


### .dirmr([dirs])


```javascript
dirmr([__dirname + "/src/node", __dirname + "/src/web"]).
join(__dirname + "/lib");
```

### .join(directory)

Joins (merges) the target directories to the output folder

### .readdir(directory, filter)

Scans the given directory for dirs to merge

```javascript
dirmr().
readdir(__dirname + "/src",/^(node|web)$/).
join(__dirname + "/lib");
```


### .copyEach(outputDir)

Copies target directories to output directory without merging

```javascript
mergedir().
readdir(__dirname + "/src", /^(node|web)$/).
copyEach(__dirname + "/bootstrap").
complete(function(err, result) {
	
})
```

### .sort(fn)

Sorts the directories

### .filterFile(search, fn)

Filters files before they're copied

```javascript
dirmr().
readdir(__dirname + "/src").
filterFile(function(options, next) {
	
	if(!/\.tpl\.\w+/.test(options.name)) return;

	//fs.writeFile(options.destination, mustache.to_html(...))

}).
join(__dirname + "/lib");
```

### .complete(callback)

Called once the operations are complete

### exports.mergeJSON(repl, obj)

merges JSON files as they're copied to the target directory

```javascript
dirmr().
readdir(__dirname + "/src").
filterFile(/.merge.json/, dirmr.mergeJSON(".json", { name: 'blah' })).
join(__dirname + "/lib");
```

### exports.parseTemplate(data)

Searches for template files, and replaces content with the data given.
supported templates: [mu](http://mustache.github.com/), [ejs](http://embeddedjs.com/)

```javascript
dirmr().
readdir(__dirname + "/src").
filterFile(dirmr.parseTemplate({ name: 'my-app', version: '0.0.10' })).
join(__dirname + "/lib");
```


