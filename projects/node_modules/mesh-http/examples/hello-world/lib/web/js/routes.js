exports.plugin = function(router) {
	
	router.on({
		
		'pull -method=GET hello/static': function(req, res) {
			res.end('hello static!');
		},

		'pull -web -method=GET hello/web': function(req, res) {
			console.log('web!')
			res.end('hello dynamic!')
		}
	});
}