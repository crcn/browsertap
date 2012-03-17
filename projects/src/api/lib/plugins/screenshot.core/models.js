module.exports = function(db) {

	var Schema = db.base.Schema,
	ObjectId = Schema.ObjectId;


	var ScreenShot = new Schema({

		//
		'screenshotId': { type: String, index: { unique: true } },

		'url': String,

		'browser': String,

		'version': String,

		'screenshot': String,

		'status': { type: String, default: 'loading' },

		'error': String
	});

	return {
		ScreenShot: db.model('screenshots', ScreenShot)
	}
}