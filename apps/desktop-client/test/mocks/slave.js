import ws from "websocket";
import http from "http";
import { NoopBus } from "mesh";
var WebSocketServer = ws.server;

class MockSlave {
  constructor({bus}) {
    this.bus = bus || new NoopBus();
  }
  async listen(port) {
    this.port = port;
    var server = this._server = http.createServer();
    await new Promise(function(resolve) {
      server.listen(port, function() {
        resolve();
      });
    });

    var ws = new WebSocketServer({
      httpServer: server,
      autoAcceptConnections: false
    });
    ws.on("request", (request) => {
      var connection = request.accept('dumb-increment-protocol', request.origin);

      connection.on("message", async function(message) {
        var op = JSON.parse(message.utf8Data);
        var resp = this.bus.execute(op);
        var chunk;
        while(chunk = await resp.read()) {
          connection.send(JSON.stringify({
            resp: op.id,
            data: chunk.value
          }));
          if (chunk.done) break;
        }
      }.bind(this));
    });
    return true;
  }
  dispose() {
    this._server.close();
  }
}

module.exports = MockSlave;
