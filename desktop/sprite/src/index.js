var Controller = require("./controller");


exports.create = function(config) {

	return new Controller().config(config);

}


var app = exports.create({
	directory: "~/Desktop/browsers"
}).
listen(8088);


app.on("browserProxy", function(proxy) {

	console.log(proxy.location.href);


	proxy.on("locationChange", function(location) {
		console.log(location.href);
	})

	proxy.on("focus", function() {
		console.log(proxy.location.href);
	})


});




app.snap("http://teamdigest.com");

app.on("screenshot", function() {
	console.log("SHOT")
});




