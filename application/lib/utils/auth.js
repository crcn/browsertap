module.exports = function(up) {
  return function(credentials, callback) {
    if(credentials.user == up.username && credentials.pass == up.password) return callback();
    return callback(new Error("Unauthorized"));
  }
}