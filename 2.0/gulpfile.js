var gulp        = require("gulp");
var mocha       = require("gulp-mocha");
var plumber     = require("gulp-plumber");
var glob        = require("glob");
var sift        = require("sift");
var browserify  = require("browserify");
var jscs        = require("gulp-jscs");
var jshint      = require("gulp-jshint");
var spawn       = require("child_process").spawn;
var uglify      = require("gulp-uglify");
var rename      = require("gulp-rename");
var source      = require("vinyl-source-stream");
var buffer      = require("vinyl-buffer");
var path        = require("path");
var collapse    = require("bundle-collapser/plugin");
var options     = require("yargs").argv;
var mergeStream = require("merge-stream");

var apps = [
  { name: "api"            , bundle: false },
  { name: "browser-client" , bundle: true  },
  { name: "common"         , bundle: false },
  { name: "desktop-client" , bundle: false }
];

var paths = {
  testFiles      : ["test/**/*.js"],
  allFiles       : ["test/**/*.js"],
  buildDirectory : path.normalize(__dirname + "/public/build")
};

var ops = {
  mocha: {
    bail     : options.bail     !== 'false',
    reporter : options.reporter || 'dot',
    grep     : options.grep     || options.only,
    timeout  : 500
  }
};

apps.forEach(function(app) {
  paths.allFiles.push("apps/" + app.name + "/**/*.js");
  paths.testFiles.push("apps/" + app.name + "/**/*-test.js");
});

/**
 */

gulp.task("bundle", function() {
  return mergeStream(sift({ bundle: true }, apps).map(function(app) {
    return browserify(__dirname + "/apps/" + app.name).
    // plugin(collapse).
    bundle().
    pipe(source(app.name + ".bundle.js")).
    pipe(buffer()).
    pipe(gulp.dest(paths.buildDirectory))
  }));
});

/**
 * TODO - modify me for all apps
 */

gulp.task("minify", ["bundle"], function() {
  return gulp.
  src(glob.sync(paths.buildDirectory + "/*.bundle.js")).
  pipe(uglify()).
  pipe(rename(function(path) {
      path.basename = path.basename.replace(".bundle", ".min");
  })).
  pipe(gulp.dest(paths.buildDirectory));
});

/**
 */

gulp.task("jscs", function() {
  return gulp.
  src(paths.allFiles).
  pipe(jscs({
      "preset": "google",
      "fileExtensions": [ ".js", "jscs" ],

      "requireParenthesesAroundIIFE": true,
      "maximumLineLength": 200,
      "validateLineBreaks": "LF",
      "validateIndentation": 2,
      "validateQuoteMarks": "\"",
      "disallowSpaceAfterObjectKeys": "ignoreMultiLine",

      "disallowKeywords": ["with"],
      "disallowSpacesInsideObjectBrackets": null,
      "disallowImplicitTypeConversion": ["string"],
      "requireCurlyBraces": [],

      "safeContextKeyword": "self",

      "excludeFiles": [
          "test/data/**",
          "./lib/parser.js"
      ]
  }));
});

/**
 */

gulp.task("jshint", function() {
    return gulp.
    src(paths.allFiles).
    pipe(jshint({
      "node"     : true,
      "bitwise"  : false,
      "eqnull"   : true,
      "browser"  : true,
      "undef"    : true,
      "eqeqeq"   : false,
      "noarg"    : true,
      "mocha"    : true,
      "evil"     : true,
      "laxbreak" : true,
      "-W100"    : true
    })).
    pipe(jshint.reporter('default'));
});

/**
 */

gulp.task("lint", ["jscs", "jshint"], function (complete) {
  complete();
});

/**
 */

gulp.task("test", function (complete) {
  gulp.
  src(paths.testFiles, { read: false }).
  pipe(plumber()).
  pipe(mocha(ops.mocha)).
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
  return gulp.run("test");
});

/**
 */

gulp.doneCallback = function (err) {

  // a bit hacky, but fixes issue with testing where process
  // doesn't exist process. Also fixes case where timeout / interval are set (CC)
  if (!~iofwatch) process.exit(err ? 1 : 0);
};
