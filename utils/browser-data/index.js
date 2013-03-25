var path = require("path"),
p = require("os").platform();

var _path = function(path) {
  return path.replace("~", process.env.HOME);
}


module.exports = {
  bucket: "browsers",
  files: [
    {
      remote: "browsers.zip",
      dir: _path(p == "win32" ? "C:\\Browsers": "~/Desktop/tmp/browser apps")
    },
    {
      remote: "google.zip",
      dir: _path(p == "win32" ? "C:\\Users\\Administrator\\AppData\\Local\\Google" : "~/Desktop/tmp/chrome")
    },
    {
      remote: "browser-links.zip",
      dir: _path(p == "win32" ? "C:\\Users\\Administrator\\Desktop\\browsers" : "~/Desktop/tmp/browsers")
    }
  ]
}