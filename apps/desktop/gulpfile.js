var gulp          = require('gulp');
var child_process = require('child_process');
var spawn         = child_process.spawn;
var exec          = child_process.exec;
var path          = require('path');
var co            = require('co');
var trim          = require('lodash/string/trim');
var os            = require('os');
var request       = require('request');
var ProgressBar   = require('progress');
var fs            = require('fs');

// TODO - build specific to stats

var chromiumDir = __dirname + '/vendor/chromium';

_task('default', make);
_task('link', link);
_task('run', run);
_task('clean', clean);
_task('clean-vendors', cleanVendors);
_task('prepare', prepare);
_task('make', make);
_task('test', test);
_task('download-vendors', downloadVendors);


var iofwatch = process.argv.indexOf('watch');
gulp.task('watch', function () {
  gulp.watch('./src/**/*', process.argv.slice(2, iofwatch));
});

function* clean() {
  yield _rmdir(__dirname + '/build');
}

function* cleanVendors() {
  yield _rmdir(__dirname + '/vendor');
}

function* run() {
  yield _spawn(['./app'], {
    cwd: __dirname + '/build/app/out/Release'
  });
}

function* link() {

  yield _os({
    darwin: function*() {
      yield _spawn(['mkdir', '-p', '/usr/local/bt']);
      yield _spawn(['rm', '-rf', '/usr/local/bt/remote-desktop-server']);
      yield _spawn(['ln', '-s', trim(yield _spawn(['pwd'])), '/usr/local/bt/remote-desktop-server']);
    }
  });
}

function* vendors() {
  // yield *libwebsockets();
  yield *webrtc();
}

function* libwebsockets() {
  var cwd      = __dirname + '/vendor/libwebsockets';
  var buildDir = cwd + '/build';

  yield _rmdir(buildDir);
  yield _mkdir(buildDir);

  yield _os({
    win32: function*() {
      yield _spawn(['cmake', '..', '-OPEN_SSL_ROOT_DIR=' + _path(__dirname + '/vendor/openssl-0.9.8r-x64_86-win64-rev2'), '-DLWS_WITH_SSL=0'], {
        cwd: buildDir
      });
    },
    darwin: function*() {
      yield _spawn(['cmake', '..', '-DCMAKE_OSX_DEPLOYMENT_TARGET=10.5', '-DCMAKE_OSX_ARCHITECTURES=x86_64', '-DLWS_WITH_SSL=0'], {
        cwd: buildDir
      });
      yield _spawn(['make'], {
        cwd: buildDir
      });
      yield _cp(buildDir + '/lib/libwebsockets.a', __dirname + '/shared/libwebsockets_darwin.a');
    }
  });
}

function *downloadVendors() {

  yield _mkdir(__dirname + '/vendor');

  var downloads = yield _os({
    win32: {
      'webrtc': 'https://www.dropbox.com/s/4smubw7mz2xdtvp/webrtcbuilds-10158-6df1ef6.zip?dl=1',
      'jsoncpp': 'https://www.dropbox.com/s/iecxx5qcqyemd2f/0.10.5.zip?dl=1',
      'websockets': 'https://www.dropbox.com/s/o2ie7xbz6fgfjwu/1.4.zip?dl=1',
      'pthreads': 'https://www.dropbox.com/s/b5cd1y4kx3t46in/2.9.1.zip?dl=1'
    },
    darwin: {
      'websockets': 'https://www.dropbox.com/s/adpkcgigf40e6kh/1.4.zip?dl=1',
      'webrtc': 'https://www.dropbox.com/s/8id0hivzk8w21el/webrtcbuilds-10183-af4ced9.zip?dl=1',
      'jsoncpp': 'https://www.dropbox.com/s/w81md5avanpgd8d/0.10.5.zip?dl=1'
    }
  });

  Object.assign(downloads, {
    depot_tools: 'https://www.dropbox.com/s/90971ldhigqxi8a/depot_tools.zip?dl=1',
    gmock: 'https://www.dropbox.com/s/8yubyq5epy6it24/gmock.zip?dl=1',
    gtest: 'https://www.dropbox.com/s/j93f56z0ewhquyh/gtest.zip?dl=1',
    gyp: 'https://www.dropbox.com/s/bdytm7rb80q1zvi/gyp.zip?dl=1'
  });

  for (zipName in downloads) {
    var url = downloads[zipName];
    if (!(yield _fileExists(__dirname + '/vendor/' + zipName))) {
      var zipPath = __dirname + '/vendor/' + zipName + '.zip';
      yield _promisifyStream(_requestStream(zipName, url).pipe(fs.createWriteStream(zipPath)));
      yield _unzip(zipPath, zipPath.replace('.zip', ''));
      yield _rmdir(zipPath);
    } else {
      console.log('skip ', zipName);
    }
  }
}

function* prepare() {
  // yield vendors();
  yield link();
  //yield _os({ win32: clean });

  var type = (yield _os({ win32: 'msvs' })) || 'make';
  type = 'msvs';

  yield _spawn(['python', './vendor/gyp/gyp_main.py', 'gyp/remote_desktop_server.gyp', '--depth=.', '-f', type, '--generator-output=./build/app']);
  // yield _spawn(['python', './vendor/gyp/gyp_main.py',  'tests.gyp', '--depth=.', '-f', type, '--generator-output=./build/app_test']);
}

function* make() {
  yield prepare();

  yield _os({
    win32: function*() {
      yield _spawn(['msbuild', 'app.vcxproj'], {
        cwd: __dirname + '/build/app/gyp'
      });
      //yield _spawn(['msbuild', './build/app_test/app_test.vcxproj']);
    },
    darwin: function*() {
      yield _spawn(['make', '-C', './build/app', 'V=1']);
      //yield _spawn(['make', '-C', './build/app_test', 'V=1']);
    }
  })
}

function* test() {
  yield _spawn(['./app_test'], {
    cwd: __dirname + '/build/app_test/out/Release'
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
  return yield _spawn(['sh', __dirname + '/scripts/' + name], {
    cwd: __dirname
  });
}

function* _cp(from, to) {
  yield _mkdir(path.dirname(to));
  return yield _os({
    'darwin win32': function*() {
      return yield _spawn(['cp', _path(from), _path(to)]);
    }
  })
}

function _spawn(args, ops) {
  return new Promise(function(resolve, reject) {

    var command = args.shift();
    console.log(command, args.join(' '));

    var proc = spawn(command, args, Object.assign({
      cwd: __dirname
    }, ops || {}));

    var buffer = [];

    proc.stdout.on('data', buffer.push.bind(buffer));
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);

    proc.on('close', function(err, code) {
      if (err) return reject(err);
      resolve(buffer.join(''));
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

function _requestStream(label, url) {
  var req = request(url);

  req.on('response', function(res) {
    var len = parseInt(res.headers['content-length'], 10);

    var bar = new ProgressBar('  ' + label + ' [:bar] :percent', {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: len
    });

    res.on('data', function (chunk) {
      bar.tick(chunk.length);
    });

    res.on('end', function () {
      console.log('\n');
    });
  })

  return req;
}

function _fileExists(path) {
  return new Promise(function(resolve, reject) {
    fs.exists(path, resolve);
  });
}

function _promisifyStream(stream) {
  return new Promise(function(resolve, reject) {
    stream.once('end', resolve);
    stream.once('error', reject);
    stream.once('finish', resolve);
  });
}

function *_unzip(zipPath, dest) {
  yield _spawn(['unzip', zipPath, '-d', dest]);
}

function *_os(methods) {
  var platform = os.platform();
  for (var n in methods) {
    if (!!~n.indexOf(platform)) return typeof methods[n] === 'function' ? yield methods[n] : methods[n];
  }
}

function _path(path) {
  return os.platform() === 'win32' ? path.replace(/\//g, '\\') : path;
}

function* _rmdir(directory, ops) {
  try {
    yield _os({
      win32: function*() {
        yield _exec(['echo y|rmdir ' + _path(directory) + ' /S'], ops);
      },
      'darwin linux': function*() {
        yield _spawn(['rm', '-rf', directory], ops);
      }
    });
  } catch(e) { }
}

function* _mkdir(directory, ops) {
  try {
    yield _os({
      win32: function*() {
        yield _exec('md ' + _path(directory), ops);
      },
      'darwin linux': function*() {
        yield _spawn(['mkdir', '-p', directory], ops);
      }
    });
  } catch(e) { }
}
