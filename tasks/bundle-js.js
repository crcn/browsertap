var stream      = require("obj-stream");
var browserify  = require("browserify");
var source      = require("vinyl-source-stream");
var buffer      = require("vinyl-buffer");
var watchify    = require("watchify");
var collapse    = require('bundle-collapser/plugin');
var path        = require("path");
var extend      = require("lodash/object/extend");
var through     = require("through2");
var uglify      = require("uglify-js");

/**
*/

var _bundles = {};

module.exports = function(pathname, shouldMinify, bundleName) {

    var currentBundle;

    var file = new stream.Stream();

    function bundleNow() {
        var bStream = _bundles[pathname];

        if (shouldMinify === true) {
            bStream = bStream.plugin(collapse);
        }

        bStream = bStream.bundle();

        if (shouldMinify === true) {
            var buffer = [];
            bStream = bStream.pipe(through(function(chunk, enc, next) {
                buffer.push(chunk);
                next();
            }, function(next) {
                var minified = uglify.minify(buffer.join(""), { fromString: true });
                // console.log(minified);
                this.push(minified.code);
                next();
            }));
        }

        bStream.pipe(file);

    }

    // cache the _bundle in case the watch argument
    // is specified
    if (!(currentBundle = _bundles[pathname])) {
        var opts = extend({}, watchify.args, {
            debug: false,
            entries: pathname,
            paths: [__dirname + "/node_modules" ],
            extensions: [".jsx"]
        });

        currentBundle = _bundles[pathname] = watchify(browserify(opts));
        currentBundle.transform({ global: true }, "reactify");
        bundleNow();
    } else {
        bundleNow(); // bundle anyways
    }

    // currentBundle.once("update", bundleNow);

    return file;
};
