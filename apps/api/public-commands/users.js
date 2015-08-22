module.exports = function(app) {
  app.publicCommands.addHandler("test", function(operation, next) {
    next(void 0, "blarg");
  });
};
