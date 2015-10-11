import { EmptyResponse, AsyncResponse } from "mesh";
import CommandsBus from "common/mesh/bus/commands";
import CommandBus from "common/mesh/bus/command";
import { spawn } from "child_process";
import path from "path";

export default function(app, bus) {

  return new CommandsBus({
    initialize: new CommandBus({
      execute: _initialize,
    }),
    spawnDesktopController: new CommandBus({
      execute: _spawnDesktopController
    })
  }, bus);

  function *_initialize(operation) {
    app.bus.execute({ name: "spawnDesktopController" });
  }

  function *_spawnDesktopController(operation) {
    var binPath = app.get("config.paths.desktopController");
    app.logger.info("spawning desktop controller %s", binPath);
    var resp = new AsyncResponse();

    var cwd     = path.dirname(binPath);
    var binName = path.basename(binPath);

    var proc = spawn(binPath);

    proc.stdout.pipe(process.stdout);
    proc.stder.pipe(process.stderr);

    proc.on("close", function(err, code) {
      if (err) return resp.error(err);
      resp.end();
    });

    return resp;
  }
}
