import _command  from "common/bus/drivers/command";

export default function(app) {
  return _command({
    execute: function*() {
      app.logger.info("synchronizing virtual windows");
    }
  })
}
