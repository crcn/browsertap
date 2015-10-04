var gulp          = require("gulp");
var child_process = require("child_process");
var spawn         = child_process.spawn;
var exec          = child_process.exec;
var path          = require("path");
var co            = require("co");
var trim          = require("lodash/string/trim");
var os            = require("os");

var paths = {

};

// TODO - build specific to stats

_task("default", make);
_task("link", link);
_task("run", run);
_task("clean", clean);
_task("prepare", prepare);
_task("make", make);
_task("test", test);
_task("vendors", vendors);

function* clean() {
  yield _rmdir(__dirname + "/build");
}

function* run() {
  yield _spawn(["./app"], {
    cwd: __dirname + "/build/app/out/Release"
  });
}

function* link() {

  yield _os({
    darwin: function*() {
      yield _spawn(["mkdir", "-p", "/usr/local/bt"]);
      yield _spawn(["rm", "-rf", "/usr/local/bt/remote-desktop-server"]);
      yield _spawn(["ln", "-s", trim(yield _spawn(["pwd"])), "/usr/local/bt/remote-desktop-server"]);
    }
  });
}

function* vendors() {
  yield *libwebsockets()
}

function* libwebsockets() {
  var cwd      = __dirname + "/vendor/libwebsockets";
  var buildDir = cwd + "/build";

  yield _rmdir(buildDir);
  yield _mkdir(buildDir);

  yield _os({
    win32: function*() {
      yield _spawn(["cmake", "..", "-OPEN_SSL_ROOT_DIR=" + _path(__dirname + "/vendor/openssl-0.9.8r-x64_86-win64-rev2"), "-DLWS_WITH_SSL=0"], {
        cwd: buildDir
      });
    },
    darwin: function*() {
      yield _script("/build_libwebsockets.sh");
      yield _cp(buildDir + "/lib/libwebsockets.a", __dirname + "/shared/libwebsockets_darwin.a");
    }
  });
}

function* _rmdir(directory, ops) {

  try {
    yield _os({
      win32: function*() {
        yield _exec(["echo y|rmdir " + _path(directory) + " /S"], ops);
      },
      "darwin linux": function*() {
        yield _spawn(["rm", "-rf", directory], ops);
      }
    });
  } catch(e) { }
}

function* _mkdir(directory, ops) {
  try {
    yield _os({
      win32: function*() {
        yield _exec("md " + _path(directory), ops);
      },
      "darwin linux": function*() {
        yield _spawn(["mkdir", "-p", directory], ops);
      }
    });
  } catch(e) { }
}

function* prepare() {
  // yield vendors();
  yield link();

  var type = (yield _os({ win32: "msvs" })) || "make";

  yield _spawn(["python", "./vendor/gyp/gyp_main.py", "remote_desktop_server.gyp", "--depth=.", "-f", type, "--generator-output=./build/app"]);
  yield _spawn(["python", "./vendor/gyp/gyp_main.py",  "tests.gyp", "--depth=.", "-f", type, "--generator-output=./build/app_test"]);
}

function* make() {
  yield prepare();

  yield _os({
    win32: function*() {
      yield _spawn(["msbuild", "./build/app/app.vcxproj"]);
      yield _spawn(["msbuild", "./build/app_test/app_test.vcxproj"]);
    },
    darwin: function*() {
      yield _spawn(["make", "-C", "./build/app", "V=1"]);
      yield _spawn(["make", "-C", "./build/app_test", "V=1"]);
    }
  })
}

function* test() {
  yield _spawn(["./app_test"], {
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

function* _script(name) {
  return yield _spawn(["sh", __dirname + "/scripts/" + name], {
    cwd: __dirname
  });
}

function* _cp(from, to) {
  yield _mkdir(path.dirname(to));
  return yield _os({
    "darwin win32": function*() {
      return yield _spawn(["cp", _path(from), _path(to)]);
    }
  })
}

function _spawn(args, ops) {
  return new Promise(function(resolve, reject) {

    var command = args.shift();
    console.log(command, args.join(" "));

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

function _exec(command, args) {
  return new Promise(function(resolve, reject) {
    console.log(command);
    exec(command, args || {}, function(err, stdout, stderr) {
      if (err) return reject(err);
      process.stdout.write(stdout);
      process.stderr.write(stderr);
      resolve();
    })
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

function *_os(methods) {
  var platform = os.platform();
  for (var n in methods) {
    if (!!~n.indexOf(platform)) return typeof methods[n] === "function" ? yield methods[n] : methods[n];
  }
}

function _path(path) {
  return os.platform() === "win32" ? path.replace(/\//g, "\\") : path;
}
