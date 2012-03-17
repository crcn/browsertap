var knox = require('knox'),
fs       = require('fs');

exports.plugin = function(router) {

	var params = this.params(),
	client     = knox.createClient({
		key: params.aws.key,
		secret: params.aws.secret,
		bucket: params.s3.bucket
	});



	router.on({

		'pull store/file': function(req, res) {
			
			var path   = req.query.path,
			savePath   = req.query.savePath,
			url        = 'https://s3.amazonaws.com/'+params.s3.bucket+'/'+savePath;

			console.log('uploading "%s" to s3', path)

			client.putFile(path, savePath, res.success(function(resp) {

				console.log('s3 response');


				resp.on('end', function() {
					res.end({
						url: url
					});
				});
			}));

		}
	})
}