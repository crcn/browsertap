var gulp          = require("gulp");
var child_process = require("child_process");
var spawn         = child_process.spawn;
var co            = require("co");
var mergeStreams  = require("merge-stream");
var rmdir         = _promisify(require("rmdir"));


var paths = {

};

_task("default", make);
_task("run", run);
_task("clean", clean);
_task("prepare", prepare);
_task("make", make);

function* clean() {
  yield rmdir(__dirname + "/build");
}

function* run() {
  yield _spawn("./app", [], {
    cwd: __dirname + "/build/app/out/Release"
  });
}

function* prepare() {
  yield _spawn("vendor/gyp/gyp", ["remote_desktop_server.gyp", "--depth=.", "-f", "make", "--generator-output=./build/app"]);
}

function* make() {
  yield prepare();
  yield _spawn("make", ["-C", "./build/app", "V=1"]);
}

function _task(name, args, callback) {

  if (arguments.length === 2) {
    callback = args;
    args     = [];
  }

  gulp.task(name, args, function(next) {
    co(callback).then(next, next);
  })
}

function _spawn(command, args, ops) {
  return new Promise(function(resolve, reject) {

    var proc = spawn(command, args, Object.assign({
      cwd: __dirname
    }, ops || {}));

    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);

    proc.on("close", function(err, code) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function _promisify(method) {
  return function() {
    var args = Array.prototype.slice.call(arguments);
    return new Promise(function(resolve, reject) {
      console.log(args);
      method.apply(global, args.concat(function(err, result) {
        if (err) return reject(err);
        resolve(result);
      }))
    });
  }
}
