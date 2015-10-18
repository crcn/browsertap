
export default function (stream) {
  var buffer = [];
  return new Promise(function(resolve, reject) {
    var buffer = [];
    stream.pipeTo({
      write: buffer.push.bind(buffer),
      abort: reject,
      close: resolve.bind(this, buffer)
    });
  });
}
