var cluster = require("cluster");

if(!cluster.isMaster) {
	require("./server");

	setTimeout(function() {
		process.exit();
	}, 1000)
} else {
	cluster.fork();
	cluster.on("exit", function() {
		cluster.fork();
	});
}