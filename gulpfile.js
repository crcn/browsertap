require("./gulp/dom");

// require("jsx-require-extension");
var gulp            = require("gulp");
var mocha           = require("gulp-mocha");
var concat          = require("gulp-concat");
var less            = require("gulp-less");
var mkdirp          = require("mkdirp");
var plumber         = require("gulp-plumber");
var glob            = require("glob");
var sift            = require("sift");
var browserify      = require("browserify");
var watchify        = require("watchify");
var babelify        = require("babelify");
var File            = require("vinyl");
var jscs            = require("gulp-jscs");
var jshint          = require("gulp-jshint");
var flatten         = require("lodash/array/flatten");
var babel           = require("babel/register")({
  optional: ["es7.classProperties", "es7.decorators"]
});
var spawn           = require("child_process").spawn;
var uglify          = require("gulp-uglify");
var rename          = require("gulp-rename");
var source          = require("vinyl-source-stream");
var buffer          = require("vinyl-buffer");
var path            = require("path");
var collapse        = require("bundle-collapser/plugin");
var options         = require("yargs").argv;
var mergeStream     = require("merge-stream");
var Stream          = require("stream").Stream;
var HomeApplication = require("./apps/home/application");
var mu              = require("mustache");
var fs              = require("fs");


var apps = [
  { name: "api"            , bundle: false },
  { name: "browser-client" , bundle: true  },
  { name: "home"           , bundle: false  },
  { name: "common"         , bundle: false },
  { name: "desktop-client" , bundle: false }
];

var paths = {
  testFiles      : ["test/**/*.js"],
  allFiles       : ["test/**/*.js"],
  lessFiles      : ["apps/common/less/**/*.less"],
  watchFiles     : [],
  buildDirectory : path.normalize(__dirname + "/public"),
  publicDirectory : path.normalize(__dirname + "/public")
};

var homeLayouts = {};

glob.sync(__dirname + "/apps/home/layouts/**.mu").map(function(filepath) {
  homeLayouts[path.basename(filepath).split(".").shift()] = fs.readFileSync(filepath, "utf8");
})


var ops = {
  mocha: {
    bail     : options.bail     !== 'false',
    reporter : options.reporter || 'dot',
    grep     : options.grep     || options.only,
    timeout  : 500,
    compilers : {
      js: babel
    }
  },
  homeLayouts : homeLayouts
};

apps.forEach(function(app) {
  paths.allFiles.push("apps/" + app.name + "/**/*.js");
  paths.testFiles.push("apps/" + app.name + "/**/*-test.js");
  paths.lessFiles.push("apps/" + app.name + "/**/*.less");
  paths.watchFiles.push("apps/" + app.name + "/**/*");
});

/**
 */

gulp.task("bundle", ["bundle-css", "bundle-js", "bundle-home"], function(next) {
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

      // b.plugin(collapse);
      b.transform({ global: true }, babelify.configure({
        optional: ["es7.classProperties", "es7.decorators"]
      }));

      _bundles[app.name] = b;

    }

    var s;

    return s = b.bundle().on("error", function(err){ console.error(err.stack); s.end(); }).pipe(source(app.name + ".bundle.js")).
    pipe(buffer()).
    pipe(gulp.dest(paths.buildDirectory + "/js"))
  }));
});

gulp.task("bundle-home", function() {
  var element = document.createElement("div");

  return;

  var app = new HomeApplication({
    element: element,
    config: {
      log: { level: 0 }
    }
  });

  app.initialize();

  for (var routeName in app.router._routes) {
    app.router.redirect(routeName);
    var loc = app.router.location;

    var html = mu.render(ops.homeLayouts[loc.state.layout || "default"], {
      state: loc.state,
      sections: {
        body: element.innerHTML
      }
    });

    var pathname = loc.pathname;

    if (pathname === "/") {
      pathname = "/index";
    } else {
      pathname += "/index";
    }

    var filename = paths.buildDirectory + pathname + ".html";
    mkdirp.sync(path.dirname(filename));
    fs.writeFileSync(filename, html);
  }
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
      "esnext"   : true,
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
  gulp.watch(paths.watchFiles, process.argv.slice(2, iofwatch));
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
