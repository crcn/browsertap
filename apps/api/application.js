import BaseApplication from 'common/application';
import extend          from 'lodash/object/extend';
import cluster         from 'cluster';
import http            from './http';
import emailer         from './emailer';
import stripe          from './stripe';
import APIBus          from './bus';
import cronTasks       from './cron-tasks';

class APIApplication extends BaseApplication {

  /**
   */

  intl = {
    messages: require('common/translations/en')
  }

  /**
   */

  initialize(next) {

    this.logger.info('bt hosts: ', this.config.hosts);
    this.logger.info('redis host: ', this.config.redis.host);
    this.logger.info('directories: ', this.config.directories);

    // fork it?
    if (cluster.isMaster && this.config.numCores > 0) {
      this.logger.info('fourk it %d times ✊', this.config.numCores);
      for (var i = this.config.numCores; i--;) this.fork();
      if (next) next();
      return;
    }

    return super.initialize(next);
  }

  /**
   */

  initializePlugins() {
    this.bus = APIBus.create(this, this.bus);
    super.initializePlugins();

    if (this.debug !== true) {
      this.use(http);
    }

    this.use(
      emailer,
      stripe,
      cronTasks
    );
  }

  /**
   */

  fork() {
    cluster.fork().once('exit', this.fork.bind(this));
  }
}

/**
 */

module.exports = APIApplication;
