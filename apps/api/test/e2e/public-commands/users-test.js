describe(__filename + "#", function() {
  it("can register a new user", function() {
    global.apiApp.publicCommands({ name: "insert", collection: "users" });
  });
});
