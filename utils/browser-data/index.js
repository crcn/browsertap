var path = require("path");

var _path = function(path) {
  return path.replace("~", process.env.HOME);
}


module.exports = {
  bucket: "browsers",
  files: [
    {
      dir: _path(p == "win32" ? "C:\\Browsers": "~/Desktop/tmp/browser apps")
    },
    {
      url: "https://s3.amazonaws.com/browsers/Google.zip",
      dir: _path(p == "win32" ? "C:\\Users\\Administrator\\AppData\\Local\\Google" : "~/Desktop/tmp/chrome")
    },
    {
      url: "https://s3.amazonaws.com/browsers/browsers+2.zip",
      dir: _path(p == "win32" ? "C:\\Users\\Administrator\\Desktop\\browsers" : "~/Desktop/tmp/browsers")
    }
  ]
}