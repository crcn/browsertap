require("./gulp/dom");

require("events").EventEmitter.defaultMaxListeners = undefined;

var gulp            = require("gulp");
var mocha           = require("gulp-mocha");
var istanbul        = require("gulp-istanbul");
var isparta         = require("isparta");
var less            = require("gulp-less");
var mkdirp          = require("mkdirp");
var plumber         = require("gulp-plumber");
var glob            = require("glob");
var sift            = require("sift");
var browserify      = require("browserify");
var resolutions     = require('browserify-resolutions');
var watchify        = require("watchify");
var babelify        = require("babelify");
var File            = require("vinyl");
var flatten         = require("lodash/array/flatten");
var packager        = require("electron-packager");
var uglify          = require("gulp-uglify");
var source          = require("vinyl-source-stream");
var buffer          = require("vinyl-buffer");
var path            = require("path");
var collapse        = require("bundle-collapser/plugin");
var options         = require("yargs").argv;
var mergeStream     = require("merge-stream");
var fs              = require("fs");
var pp = require("package-path");



function keepJsFile(path) {
  var pkg = require(pp.sync(path) + "/package.json");
  return pkg.es6;
}

var babelOptions = ["es7.classProperties", "es7.decorators", "es7.asyncFunctions"];

var babel = require("babel/register")({
  optional: babelOptions,
  ignore: function(f) { return !keepJsFile(f); }
})

var apps = [
  { name: "api"            , bundle: false },
  { name: "browser-client" , bundle: true  },
  { name: "common"         , bundle: false },
  { name: "desktop-client" , bundle: false }
];

var appNames = apps.map(function(app) {
  return app.name;
});

var ignore          = "!apps/*/{node_modules,node_modules/**}";
var appsFilesPrefix =  "apps/{" + appNames.join(",") +"}/**";

var paths = {
  testFiles       : [ignore, "test/**/*.js", appsFilesPrefix + "/*-test.js"],
  allFiles        : [ignore, "test/**/*.js", appsFilesPrefix],
  jsFiles         : [ignore, "test/**/*.js", appsFilesPrefix + "/*.js", appsFilesPrefix + "/*.jsx"],
  lessFiles       : [appsFilesPrefix + "/*.less"],
  watchFiles      : [appsFilesPrefix, ignore],
  buildDirectory  : path.normalize(__dirname + "/public"),
  publicDirectory : path.normalize(__dirname + "/public"),
  gulpFiles       : "apps/{desktop}/gulpfile.js"
};

var ops = {
  mocha: {
    bail     : options.bail     !== 'false',
    reporter : options.reporter || 'dot',
    grep     : options.grep     || options.only,
    timeout  : options.timeout  || 1000 * 2,
    compilers : {
      js: babel
    }
  }
};

/**
 */

gulp.task("bundle", ["bundle-css", "bundle-js"], function(next) {
  next();
});

/**
 */

gulp.task("bundle-css", function() {

  var concated = flatten(paths.lessFiles.map(function(g) {
    return glob.sync(g);
  })).map(function(filepath) {
    return fs.readFileSync(filepath, "utf8");
  }).join("\n");

  var file = new File({
    basename: "all.css",
    contents: new Buffer(concated)
  });

  return file.pipe(source("all.css")).pipe(buffer()).pipe(less())
    .pipe(gulp.dest(__dirname + '/public/css'));
});

/**
 */

var _bundles = {};


gulp.task("bundle-js", function() {
  return mergeStream(sift({ bundle: true }, apps).map(function(app) {

    var b;

    if (!(b = _bundles[app.name])) {

      var opts = Object.assign({}, watchify.args, {
          debug: false,
          entries: [require.resolve(__dirname + "/apps/" + app.name)],
          extensions: [".jsx"]
      });

      b = watchify(browserify(opts));

      // b.plugin(resolutions, "*");

      // b.plugin(collapse);
      b.transform({ global: true }, babelify.configure({
        optional: babelOptions,
        ignore: ["buffer"]
      }));

      _bundles[app.name] = b;

    }

    var s;

    return s = b.bundle().on("error", function(err){ console.error(err.stack); s.end(); }).pipe(source(app.name + ".bundle.js")).
    pipe(buffer()).
    pipe(gulp.dest(paths.buildDirectory + "/js"))
  }));
});

/**
 * TODO - modify me for all apps
 */

gulp.task("minify-js", ["bundle-js"], function() {
  return gulp.
  src(glob.sync(paths.buildDirectory + "/*.bundle.js")).
  pipe(uglify()).
  pipe(gulp.dest(paths.buildDirectory));
});

/**
 */

// TODO - run c++ unit tests here as well
gulp.task("test", function (complete) {
  gulp.
  src(paths.testFiles, { read: false }).
  pipe(plumber()).
  pipe(mocha(ops.mocha)).
  on("error", complete).
  on("end", complete);
});

/**
 */

gulp.task("test-coverage-hook", function() {
  return gulp.src(paths.jsFiles)
  .pipe(istanbul({
    instrumenter: isparta.Instrumenter,
    includeUntested: true,
    babel: {
      optional: babelOptions
    }
  }))
  .pipe(istanbul.hookRequire());
});

/**
 */

gulp.task("test-coverage", ["test-coverage-hook"], function() {
  return gulp
  .src(paths.testFiles, { read: false })
  .pipe(plumber())
  .pipe(mocha(ops.mocha))
  .pipe(istanbul.writeReports({
    reporters: ["text", "text-summary", "json", "html"]
  }))
  .pipe(istanbul.enforceThresholds({ thresholds: { global: 95 } }));
});

var iofwatch = process.argv.indexOf("watch");

/**
 * runs previous tasks (1 or more)
 */

gulp.task("watch", function () {
  gulp.watch(paths.watchFiles, process.argv.slice(2, iofwatch));
});

/**
 */

gulp.task("default", function () {
  return gulp.run("test");
});

/**
 */

gulp.task("package", ["package-eyebrowse"], function() {
});

/**
 */

gulp.task("package-eyebrowse", function(next) {
  packager({
    name: "eyebrowse",
    version: "0.33.4",
    platform: "darwin",
    arch: "x64",
    dir: __dirname + "/apps/desktop-client",
    out: __dirname + "/public/build/eyebrowse"
  }, next);
});

/**
 */

gulp.doneCallback = function (err) {

  // a bit hacky, but fixes issue with testing where process
  // doesn't exist process. Also fixes case where timeout / interval are set (CC)
  if (!~iofwatch) process.exit(err ? 1 : 0);
};
