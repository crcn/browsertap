var hurryUp = require("hurryup"),
request     = require("request"),
step        = require("step");


/**
 * TODO - fetch from server the current owner
 */

module.exports = require("../base/model").extend({

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
    this.set("lastUsedAt", new Date());

    //set the owner to EC2 - this is required incase BT crashes
    if(this._instance)
    this._instance.tags.findOne({ key: "owner" }, function(err, tag) {

      //no owner id? destroy the tag 
      if(!ownerid) {
        if(owner) owner.destroy();
        return;
      }

      if(!tag) {
        self._instance.tags.create({ key: "owner", value: ownerid }, function(){});
      } else {
        tag.update( { $set: { value: ownerid }});
      }
    });

    if(ownerid) {
      this._checkUsage();
    }
  },

  /**
   */

  "start": function(callback) {

    if(this._running) return;
    this._running = true;

    console.log("start instance %s", this.get("_id"));

    var self = this;

    if(this._instance) {
      this._instance.start(function() {
        self._ping();
      });
    } else {

      //otherwise ping immediately
      this._ping();
    }
  },

  /**
   */

  "stop": function(callback) {
    console.log("stop instance %s", this.get("_id"));
    this._instance.stop(callback);
  },

  /**
   */

  "_ping": function() {

    var tries = 50, 
    self = this,
    address = self.get("dnsName") || self.get("address");

    hurryUp(function(next) {

      console.log("ping %s", self.get("_id"));

      var data = {
        url  : self._address() + "/config",
        json : self.get()
      };


      request.post(data, outcome.e(next).s(function(req, body) {
        console.log("ping %s", self.get("_id"))
        self.emit("ready");
        self._checkUsage();
      }));

    }, { timeout: 1000 * 60 * 10, retry: true }).call(this, outcome.e(function() {

      console.log("failed to ping %s, restarting", address);

      if(self._instance) {
        self._instance.restart();
      }

    }).s(function() {
      console.log("successfuly pinged server");
    }));
  },

  /**
   */

  "_load": function() {
    if(this.get("state") == "stopped") return;
    this.start();

    var self = this;
  },


  /**
   */

  "_checkUsage": function() {

    if(!this._getOwner()) return;


    var self = this;

    function checkUsage() {
      setTimeout(function(){
        self._checkUsage();
      }, 1000 * 10);
    }

    request.get(this._address() + "/info", function(err, req, body) {
      if(err) return checkUsage();
      if(!body.owner) {

        //user not assigned for N seconds?
        if((Date.now() - 1000 * 10) > self.get("lastUsedAt").getTime()) {

          //remove the owner
          self.setOwner(undefined);
        }

      } else {

        //otherwise reset lastUsedAt so this server doesn't get destroyed
        self.set("lastUsedAt", new Date());
      }
    });
  },


  /**
   */

  "_getOwner": function() {
    if(this._instance) {
      return this._instance.tags.findOne({ key: "owner", value: { $ne: undefined } }).sync()
    } else {
      return this.get("owner");
    }
  },

  /**
   * call this if the user is past their alloted time
   */

  "_kickUserOut": function() {
    request.post(this._address() + "/kick-user", function(req, res) {

    });
  },

  /**
   */

  "_address": function() {
    return "http://" + (this.get("dnsName") || this.get("address")) + ":" + this.get("port");
  }
});
