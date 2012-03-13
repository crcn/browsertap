exports.plugin = function(router) {
	
	router.on({
		
		'pull -method=GET hello': function(req, res) {
			res.end('hello world!');
		}
	});
}