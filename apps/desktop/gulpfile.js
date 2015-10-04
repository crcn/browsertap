var gulp          = require("gulp");
var child_process = require("child_process");
var spawn         = child_process.spawn;
var co            = require("co");
var rmdir         = _promisify(require("rmdir"));
var trim          = require("lodash/string/trim");

var paths = {

};

_task("default", make);
_task("link", link);
_task("run", run);
_task("clean", clean);
_task("prepare", prepare);
_task("make", make);
_task("test", test);

function* clean() {
  yield rmdir(__dirname + "/build");
}

function* run() {
  yield _spawn("./app", [], {
    cwd: __dirname + "/build/app/out/Release"
  });
}

function* link() {
  yield _spawn("mkdir", ["-p", "/usr/local/bt"]);
  yield _spawn("rm", ["-rf", "/usr/local/bt/remote-desktop-server"]);
  yield _spawn("ln", ["-s", trim(yield _spawn("pwd")), "/usr/local/bt/remote-desktop-server"]);
}

function* prepare() {
  yield link();
  yield _spawn("vendor/gyp/gyp", ["remote_desktop_server.gyp", "--depth=.", "-f", "make", "--generator-output=./build/app"]);
  yield _spawn("vendor/gyp/gyp", ["tests.gyp", "--depth=.", "-f", "make", "--generator-output=./build/app_test"]);
}

function* make() {
  yield prepare();
  yield _spawn("make", ["-C", "./build/app", "V=1"]);
  yield _spawn("make", ["-C", "./build/app_test", "V=1"]);
}

function* test() {
  yield _spawn("./app_test", [], {
    cwd: __dirname + "/build/app_test/out/Release"
  });
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

    console.log(command, (args || []).join(" "));

    var proc = spawn(command, args, Object.assign({
      cwd: __dirname
    }, ops || {}));

    var buffer = [];

    proc.stdout.on("data", buffer.push.bind(buffer));
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);

    proc.on("close", function(err, code) {
      if (err) return reject(err);
      resolve(buffer.join(""));
    });
  });
}

function _promisify(method) {
  return function() {
    var args = Array.prototype.slice.call(arguments);
    return new Promise(function(resolve, reject) {
      method.apply(global, args.concat(function(err, result) {
        if (err) return reject(err);
        resolve(result);
      }))
    });
  }
}
