exec = require("child_process").exec,
_ = require("underscore")

module.exports = {

        //url to proxy when running tests - important to prevent cross-site security
        //issues
        proxy: "http://student.classdojo.dev:8080",

        //tests to run - these are actually loaded in the browser
        scripts: [
                __dirname + "/test/**.js"
        ],

        //data-types to cache
        cache: {
                types: ["json", "png"],
                directory: __dirname + "/test2/cache"
        },

        //files to watch, then reload
        watch: [
                __dirname + "/public/**",
                __dirname + "/test/**"
        ],

        //port to run tests on - open in http://localhost:8083/test
        port: 8083,

        //full integration
        full: true,

        //keep the tests alive for dev mode
        keepAlive: true,

        //called each time browsers are reloaded to run tests
        reload: _.throttle(function(next) {
                console.log("reloading fixtures")
                exec("./node_modules/.bin/libretto import " + __dirname + "/test/db-fixtures --database=dojo-dev");
        }, 500)
}
