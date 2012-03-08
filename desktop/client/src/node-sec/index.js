/*var exec = require('child_process').exec;

console.log("GO")

exec('start /HIGH /MAX C:\\"Program Files"\\"Mozilla Firefox"\\firefox.exe http://google.com', function() {

})*/


var beanie = require('beanie'),
loader = beanie.loader();


loader.
require(__dirname + "/plugins").
params({
	browsersDir: '~/Desktop/browsers'
}).
load(function() {

});