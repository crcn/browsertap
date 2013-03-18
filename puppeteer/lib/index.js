var cluster = require("cluster");

if(!cluster.isMaster) {
	require("./server");
} else {
	cluster.fork();
	cluster.on("exit", function() {
		cluster.fork();
	});
}