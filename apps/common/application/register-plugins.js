module.exports = function(app, plugins) {
  plugins.forEach(function(plugin) {
    var commands = plugin(app);

    if (!commands) return;

    var disposables = [];

    for (var name in commands) {
      disposables.push(app.internalCommands.addHandler(name, commands[name]));
    }

    app.internalCommands.addHandler("terminate", function(operation, next) {
      disposables.forEach(function(disposable) {
        disposable.dispose();
      });
      next();
    });
  });
};
