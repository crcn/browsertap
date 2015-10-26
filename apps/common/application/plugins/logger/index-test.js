import loggerPlugin from './index';
import expect from 'expect.js';
import LogLevels from 'common/logger/levels';

describe(__filename + '#', function() {

  it('attaches .logger property to the model', function() {
    loggerPlugin({ config: { log: true }});
  });

  it('gets config properties from the model', function() {

    var model = {
      config: {
        log: {
          level: LogLevels.VERBOSE
        }
      }
    };

    loggerPlugin(model);

    expect(model.logger.level).to.be(LogLevels.VERBOSE);
  });

  it('re-routes all logs back to the application bus', function() {

    var ops = [];

    var model = {
      bus: {
        execute: ops.push.bind(ops)
      },
      config: {
        log: {
          level: LogLevels.ALL
        }
      }
    };

    loggerPlugin(model);

    model.logger.notice('hello world');
    expect(ops.length).to.be(1);
  });
});
