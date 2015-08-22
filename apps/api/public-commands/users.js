module.exports = function(app) {
  app.publicCommands.addHandler({

    insert: function(operation, next) {
      console.log("INSERT USER");
    }

  }, { collection: "users" });
};
