var os = require("os"),
p = os.platform(),
async = require("async"),
step = require("step"),
fs = require("fs"),
outcome = require("outcome"),
mkdirp = require("mkdirp"),
rmdir = require("rmdir"),
path = require("path"),
request = require("request"),
unzip = require("unzip"),
http = require("http"),
ProgressBar = require("progress");


var _path = function(path) {
  return path.replace("~", process.env.HOME);
}

var config = {
  dirs: {
    downloads: _path(p == "windows" ? "C:\\Users\\Administrator" : "~/Desktop/tmp/downloads")
  },
  downloads: [
    {
      url: "https://s3.amazonaws.com/browsers/browser-apps.zip",
      dir: _path(p == "windows" ? "C:\\Users\\Administrator\\Desktop\\browsers": "~/Desktop/tmp/browsers")
    },
    {
      url: "https://s3.amazonaws.com/browsers/Google.zip",
      dir: _path(p == "windows" ? "C:\\Users\\Administrator\\AppData\\Local" : "~/Desktop/tmp/chrome")
    },
    {
      url: "https://s3.amazonaws.com/browsers/browsers+2.zip",
      dir: _path(p == "windows" ? "C:\\Browsers" : "~/Desktop/tmp/browser apps")
    }
  ]
}


function showProgress(res) {
  console.log();
  var len = parseInt(res.headers['content-length'], 10);
  var bar = new ProgressBar('  downloading [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: len,
  });

  res.on('data', function(chunk){
    bar.tick(chunk.length);
  });

  res.on('end', function(){
    console.log('\n');
  });
}

function download(pkg, next) {

  var o = outcome,
  downloadFile = path.join(config.dirs.downloads, path.basename(pkg.url))

  step(
    function() {
      fs.unlink(downloadFile, this);
    },
    function() {
      if(!fs.existsSync(pkg.dir)) return this();

      console.log("rm -rf %s", pkg.dir);

      rmdir(pkg.dir, this);
    },
    function() {
      console.log("mkdir -p %s", pkg.dir);
      mkdirp(pkg.dir, this);
    },
    function() {
      console.log("mkdir -p %s", config.dirs.downloads);
      mkdirp(config.dirs.downloads, this);
    },
    function() {
      console.log("download %s", pkg.url);
      var req = request(pkg.url);

      req.on("response", showProgress);

      req.pipe(unzip.Extract({ path: pkg.dir }));
      req.pipe(fs.createWriteStream(downloadFile, { flags: "w+" }));
      
      req.on("end", this).on("error", this);
    },
    o.s(function() {
      console.log("DONE");
      this();
    }),
    next
  );
}


async.eachSeries(config.downloads, download, function() {
  console.log("DONE")
});
