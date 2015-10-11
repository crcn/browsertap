import pump from "mesh/internal/pump-stream";

export default function (stream) {
  return new Promise(function(resolve, reject) {
    var buffer = [];
    pump(stream, ({value, done}) => {
      if (done) {
        return resolve(buffer);
      } else {
        buffer.push(value);
      }
    }, reject);
  });
}
