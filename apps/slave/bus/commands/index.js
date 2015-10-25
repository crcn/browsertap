import { EmptyResponse, Response } from 'mesh';
import CommandsBus from 'common/mesh/bus/commands';
import CommandBus from 'common/mesh/bus/command';
import { spawn } from 'child_process';
import path from 'path';

export function create(app, bus) {

  return CommandsBus.create({
    initialize: CommandBus.create({
      execute: _initialize,
    }),
    spawnDesktopController: CommandBus.create({
      execute: _spawnDesktopController
    })
  }, bus);

  function _initialize(operation) {
    app.bus.execute({ action: 'spawnDesktopController' });
  }

  function _spawnDesktopController(operation) {
    var binPath = app.get('config.paths.desktopController');
    app.logger.info('spawning desktop controller %s', binPath);

    return Response.create(function(writable) {

      var cwd     = path.dirname(binPath);
      var binName = path.basename(binPath);

      var proc = spawn(binPath);

      proc.stdout.pipe(process.stdout);
      proc.stder.pipe(process.stderr);

      proc.on('close', function(err, code) {
        if (err) return writable.error(err);
        writable.close();
      });
    });
  }
}
