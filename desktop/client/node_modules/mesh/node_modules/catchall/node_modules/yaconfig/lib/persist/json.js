var nodefs = require('node-fs'),
fs  = require('fs'),
path = require('path')

exports.decode = function(string) {

    return JSON.parse(string);

}

exports.encode = function(config) {
 
    return JSON.stringify(config, null, 2);

}

exports.read = function(input, callback) {

    try {
        //make the directory to the output
        nodefs.mkdirSync(path.dirname(input), 0755, true);
    } catch(e) { }

    var config;

	try {
        config = exports.decode(fs.readFileSync(input, 'utf8'));
    } catch(e) { }

	callback(config);
	
}

exports.write = function(source, config) {
	
    fs.writeFileSync(source, exports.encode(config));

}