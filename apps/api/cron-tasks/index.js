var CronJob = require('cron').CronJob;

export default function(app) {

  var jobs = app.get('config.jobs') || [];

  app.logger.info('cron jobs: ', jobs);

  jobs.forEach(function(operation) {
    new CronJob(operation.cron, function() {
      app.logger.info('run cron job: %s', operation.action);
      app.bus.execute(operation);
    }, void 0, true);
  });
}