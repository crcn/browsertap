var gulp       = require("gulp");
var mocha      = require("gulp-mocha");
var plumber    = require("gulp-plumber");
var browserify = require("browserify");
var spawn      = require("child_process").spawn;
var uglify     = require("gulp-uglify");
var source     = require("vinyl-source-stream");
var buffer     = require("vinyl-buffer");
var collapse   = require("bundle-collapser/plugin");
var options    = require("yargs").argv;

var apps = [
  { name: "api"     },
  { name: "browser" },
  { name: "common"  },
  { name: "desktop" }
];

var paths = {
  testFiles : ["test/**/*.js"],
  allFiles  : ["test/**"]
};

apps.forEach(function(app) {
  paths.allFiles.push(app.name + "/**");
  paths.testFiles.push(app.name + "/**/*-test.js");
});


/**
 */

var mochaOptions = {
  bail     : options.bail     !== 'false',
  reporter : options.reporter || 'dot',
  grep     : options.grep     || options.only,
  timeout  : 500
}

/**
 */

function bundle(src, out) {
    return browserify(src).
    plugin(collapse).
    bundle().
    pipe(source(out)).
    pipe(buffer()).
    pipe(gulp.dest('./dist'));
}

/**
 */

gulp.task("bundle", function() {
  return bundle(pkg.browser || pkg.main, pkg.name + ".js");
});

/**
 */

gulp.task("minify", ["bundle", "bundle-parser"], function() {
  return gulp.
  src(["./dist/" + pkg.name + ".js", "./dist/parser.js"]).
  pipe(uglify()).
  pipe(rename(function(path) {
      path.basename += ".min";
  })).
  pipe(gulp.dest('./dist'));
});

/**
 */

gulp.task("test", function (complete) {
  gulp.
  src(paths.testFiles, { read: false }).
  pipe(plumber()).
  pipe(mocha(mochaOptions)).
  on("error", complete).
  on("end", complete);
});

var iofwatch = process.argv.indexOf("watch");

/**
 * runs previous tasks (1 or more)
 */

gulp.task("watch", function () {
  gulp.watch(paths.allFiles, process.argv.slice(2, iofwatch));
});

/**
 */

gulp.task("default", function () {
  return gulp.run("test-coverage");
});

/**
 */

gulp.doneCallback = function (err) {

  // a bit hacky, but fixes issue with testing where process
  // doesn't exist process. Also fixes case where timeout / interval are set (CC)
  if (!~iofwatch) process.exit(err ? 1 : 0);
};
