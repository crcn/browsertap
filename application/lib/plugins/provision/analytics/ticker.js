var structr = require("structr");

module.exports = structr({

  /**
   */

  "__construct": function(name, frequency, analytics) {
    this.frequency = frequency;
    this.name = name;
    this._analytics = analytics;
    this._i = 0;
  },

  /** 
   */

  "tick": function() {

    if(!this._tracker) this._tracker = this._analytics.tracker(this.name);

    //after the frequency, get the ticks per second
    if(this._i++ > this.frequency) {
      var tps = this._i / ((Date.now() - this._tracker.createdAt.getTime()) / 1000);
      this._tracker.track({ ticksPerSecond: tps });
      this._i = 0;
    }
  }
});