var http = require('http');

http.createServer(function(req, res) {
res.end("hello!");
}).listen(1337);