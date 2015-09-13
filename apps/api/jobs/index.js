var CronJob = require("cron").CronJob;

export default function(app) {
  // console.log("CHARGE");

  var jobs = app.get("config.jobs") || [];

  app.logger.info("cron jobs: ", jobs);

  jobs.forEach(function(operation) {
    new CronJob(operation.cron, function() {
      app.logger.info("run cron job: %s", operation.name);
      app.bus(operation);
    }, void 0, true);
  });
}