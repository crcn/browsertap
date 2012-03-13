(function() {
  var ejs, path, render, traverse;

  ejs = require('ejs');

  traverse = require('traverse');

  path = require('path');

  render = function(value, data) {
    var clone;
    clone = traverse(value).clone();
    return traverse(clone).forEach(function(x) {
      var rendered;
      if (!(typeof x === 'string')) return;
      rendered = x;
      while (rendered.indexOf('<%') > -1) {
        rendered = ejs.render(rendered, data);
      }
      if (data.cwd) {
        rendered = path.normalize(rendered.replace(/^\./, data.cwd + "/.").replace(/^~/, process.env.HOME + "/"));
      }
      return this.update(rendered);
    });
  };

  exports.render = render;

}).call(this);
