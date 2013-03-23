var config = require("../../config")("production"),
knox = require("knox"),
step = require("step");

var client = knox.createClient({
  key: config.aws.key,
  secret: config.aws.secret,
  bucket: "browsers"
});


step(

  /**
   * 1. zip files
   */

  function() {

  }
)

client.list(function(err, data) {
  console.log(data.Contents);
})
