var hurryUp = require("hurryup"),
request     = require("request"),
step        = require("step");


/**
 * TODO - fetch from server the current owner
 */

module.exports = require("../base").extend({

  /**
   */

  "init": function() {
    this._instance = this._targetModel();

    //flag so that this instance isn't fetched before it's ready
    this.update({$set:{ "ready": false }});

    this._load();
  },


  /**
   */

  "setOwner": function(ownerid) {

    //set it immediately so it's locked
    this.set("owner", ownerid);

    var self = this;

    //set the owner to EC2 - this is required incase BT crashes
    this.tags.findOne({ key: "owner" }, function(err, owner) {
      if(!owner) {
        self.tags.create({ key: "owner", value: owner }, function(){});
      } else {
        owner.update( { $set: { value: ownerid }});
      }
    });
  },

  /**
   */

  "start": function(callback) {

    if(this._running) return;
    this._running = true;

    console.log("start instance %s", this.get("_id"));

    var self = this;

    this._instance.start(function() {
      self._ping();
    });
  },

  /**
   */

  "_ping": function() {

    var tries = 50, self = this;

    function ping() {

      //no tries? restart, then try again.
      if(!--tries) {
        self.update({ $set: { "error": "unable to ping server" }});

        //TODO - check if the server 
        return self._instance().restart();
      }


      console.log("ping instance %s", self.get("_id"));
    }

    ping();
  },

  /**
   */

  "_load": function() {
    if(this.get("state") == "stopped") return;
    this.start();

    var self = this;
    this.once("ready", function() {

      
    });
  }
});
