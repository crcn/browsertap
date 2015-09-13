
import BaseModel from "common/data/models/base/model";
import Location from "./location";
import debounce from "lodash/function/debounce";
import qs from "qs";

/**
 * _setter for a deep path
 */

function _set(target, path, value) {
  var current = target;
  var pathParts = path.split(".");
  for (var i = 0, n = pathParts.length - 1; i < n; i++) {
    var key = pathParts[i];
    if (!current[key]) current[key] = {};
    current = current[key];
  }
  current[pathParts[i]] = value;
}

/**
 * getter for a deep path
 */

function _get(target, path) {
  var current = target;
  var pathParts = path.split(".");

  for (var i = 0, n = pathParts.length; i < n; i++) {
    var key = pathParts[i];
    if (current[key] == void 0) return void 0;
    current = current[key];
  }
  return current;
}

/**
 */

function _parseUrl(url) {
  var path      = url.replace("#", "");
  var pathParts = path.split("?");
  return {
    pathname : pathParts.shift(),
    query    : pathParts.length ? qs.parse(pathParts.pop()) : {}
  };
}

/**
 */

function _bindWindowLocation(router) {

  // when the location changes in the hash, reflect that change
  // back down to the application state.
  window.onpopstate = function() {
    var newLocation = getNewLocation();
    if (!newLocation) return;
    router.redirect(newLocation);
  };

  function getNewLocation() {
    var newLocation = new Location(_parseUrl(window.location.hash));
    if (router.location.toString() !== newLocation.toString()) {
      return newLocation.toString();
    } 
    return void 0;
  }

  // watch the location for any change, stringify it, then reflect
  // that change in the location hash. This will ensure that the user
  // is able to reload the page and still maintain the application state
  router.location.on("change", debounce(function(op, np) {
    if (!getNewLocation()) return;
    location.hash = router.location.toString(); 
    // history.pushState({}, router.location.state.title, router.location.toString());
  }), 10);
}

class Router extends BaseModel {

  /**
   */

  constructor(properties) {
    super(properties);
    this.location = new Location();
    this._routes = {};
    if (process.browser && this.sync !== false) {
      _bindWindowLocation(this);
    }
  }

  /**
   */ 

  initialize() {

    // redirect
    if (process.browser) {
      this.redirect(location.hash === "" ? "/" : location.hash); 
    }
  }

  /**
   */

  addRoute(alias, pathname, ...handlers) {

    var handler = function(location) {
      var i = 0;
      function next() {
        if (i < handlers.length) handlers[i++](location, next);
      }
      next();
    }

    if (!handler) handler = function() { };

    // convert something like /home/:id/path to /home/(\w+)/
    var pathTester = new RegExp("^" + pathname.replace(/(:[^\/]+)/g, "([^\/]+)") + "$");
    var paramNames = pathname.split("/").filter(function(path) {
      return path.charAt(0) === ":";
    }).map(function(pathname) {
      return pathname.substr(1);
    });

    this._routes[alias] = {
      pathname: pathname,
      pathTester: pathTester,
      getPathname: function(aliasOrPathname, options) {
        if (!options) options = {};

        if (!options.params) options.params = {};

        // add params
        if (aliasOrPathname !== alias) {
          aliasOrPathname.match(pathTester).slice(1).forEach(function(param, i) {
            _set(options.params, paramNames[i], param);
          });
        }

        var fullpath = pathname;

        pathname.match(pathTester).slice(1).forEach(function(param, i) {
          fullpath = fullpath.replace(param, _get(options.params, paramNames[i]));
        });

        return fullpath;
      },
      test: function(pathname) {
        return pathname === alias || pathTester.test(pathname);
      },
      handler: handler
    };
  }

  /**
   */

  setQuery(query) {
    this.redirect({
      query: Object.assign({}, this.location.query, query)
    }) 
  }

  /**
   */

  redirect(aliasOrPathname, options) {

    // just modify the options 
    if (arguments.length === 1 && typeof aliasOrPathname === "object") {
      options         = aliasOrPathname;
      // TODO - take params into consideration 
      aliasOrPathname = this.location.pathname;
    }

    if (!options) options = {};

    aliasOrPathname = aliasOrPathname.replace(/\/+/g, "/");

    var pathParts = _parseUrl(aliasOrPathname);

    var route = this.getRoute(pathParts.pathname);

    this.location.setProperties(Object.assign({
      pathname: route ? route.getPathname(pathParts.pathname, options) : pathParts.pathname,
      params  : options.params, 
      query   : Object.assign({}, options.query, pathParts.query)
    }, options));

    if (route) {
      route.handler(this.location);
    } else {
      var error = new Error("not found");
      error.code = 404;
      this.emit("error", error);
    }
  }

  /**
   * returns /just/the/path/name
   */

  getPathname(aliasOrPathname, options) {
    var route = this.getRoute(aliasOrPathname);
    return route ? route.getPathname(aliasOrPathname, options) : aliasOrPathname;
  }

  /**
   * returns something like /path?query=value
   */

  getPath(aliasOrPathname, options) {
    var pathname = this.getPathname(aliasOrPathname, options);
    return (new Location({
      pathname: pathname,
      query: options.query
    })).toString();
  }

  /**
   * returns something like /path?query=value
   */

  getUrl(aliasOrPathname, options) {
    return "#" + this.getPathname(aliasOrPathname, options); 
  }

  /**
   */

  getRoute(aliasOrPathname) {
    // aliasOrPathname = aliasOrPathname.replace(/\/+/g, "/"); // remove double slashes

    for (var alias in this._routes) {
      var route = this._routes[alias];
      if (route.test(aliasOrPathname)) return route;
    }
  }
}

export default Router;
