var gulp       = require("gulp");
var mocha      = require("gulp-mocha");
var plumber    = require("gulp-plumber");
var browserify = require("browserify");
var jscs       = require("gulp-jscs");
var jshint     = require("gulp-jshint");
var spawn      = require("child_process").spawn;
var uglify     = require("gulp-uglify");
var source     = require("vinyl-source-stream");
var buffer     = require("vinyl-buffer");
var collapse   = require("bundle-collapser/plugin");
var options    = require("yargs").argv;

var apps = [
  { name: "api"     , bundle: false },
  { name: "browser" , bundle: true  },
  { name: "common"  , bundle: false },
  { name: "desktop" , bundle: false }
];

var paths = {
  testFiles : ["test/**/*.js"],
  allFiles  : ["test/**/*.js"]
};

apps.forEach(function(app) {
  paths.allFiles.push(app.name + "/**/*.js");
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
 * TODO - modify me for all apps
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
