var postmark = require("postmark")

exports.plugin = function(loader) {
	var mailer = postmark(loader.params("postmark.apiKey"));

	return {
		send: function(doc, callback) {
			mailer.send({
				"From": doc.from || loader.params("postmark.from"),
				"To": doc.to,
				"Subject": doc.subject,
				"HtmlBody": doc.body
			}, callback);
		}
	}
}