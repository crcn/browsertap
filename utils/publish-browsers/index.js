var config = require("../../config")("production"),
knox = require("knox"),
step = require("step"),
async = require("async"),
browserData = require("../browser-data"),
AdmZip = require("adm-zip");

var client = knox.createClient({
  key: config.aws.key,
  secret: config.aws.secret,
  bucket: browserData.bucket
});


var o = require("outcome");


o.error(function(err) {
	console.log(err)
})


step(

  /**
   * 1. cleanup
   */

  function() {

  	var next = this;

	client.list(function(err, data) {
	  async.forEach(data.Contents, function(file, next) {
	 	console.log("delete file %s", file.Key);
	  	client.deleteFile(file.Key, next);
	  }, next);
	})
  },
  o.s(function() {
  	async.eachSeries(browserData.files, publishDir, this);
  })
)



function publishDir(options, next) {
	client
}


