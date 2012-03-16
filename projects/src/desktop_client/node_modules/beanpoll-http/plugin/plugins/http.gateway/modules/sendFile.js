var fs = require('fs');

module.exports = function(req, res) {
	
	res.sendFile = function(path) {
		
		fs.stat(path, function(err, stat)
		{
			if(err || stat.isDirectory())
			{           
				res.writeHead(404, {'Content-Type': 'text/plain'});
				return res.sendError();
			}

			res.writeHead(200, { 'Content-Length': stat.size, 'Content-Type': mime.lookup(path) } );


			fs.createReadStream(path, {flags: 'r', 
			encoding: 'binary', 
			mode: 0666,
			bufferSize: 4 * 1024})

			.addListener("data", function(chunk){
				res.write(chunk, 'binary');
			})
			.addListener("close",function() {
				res.end();
			})
			.addListener("error", function (e) {
				res.error(e);
			});
		}); 

	}
}