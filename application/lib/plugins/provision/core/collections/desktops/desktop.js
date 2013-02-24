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
    this.set("lastUsedAt", new Date());

    //set the owner to EC2 - this is required incase BT crashes
    this.tags.findOne({ key: "owner" }, function(err, tag) {

      //no owner id? destroy the tag 
      if(!ownerid) {
        if(owner) owner.destroy();
        return;
      }

      if(!tag) {
        self.tags.create({ key: "owner", value: ownerid }, function(){});
      } else {
        tag.update( { $set: { value: ownerid }});
      }
    });

    if(ownerid)
    this._checkUsage();
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

  "stop": function(callback) {
    console.log("stop instance %s", this.get("_id"));
    this._instance.stop(callback);
  },

  /**
   */

  "_ping": function() {

    var tries = 50, 
    self = this,
    address = self._instance.get("dnsName");

    function ping() {

      //no tries? restart, then try again.
      if(!--tries) {
        self.update({ $set: { "error": "unable to ping server" }});

        //TODO - check if the server 
        return self._instance.restart();
      }


      console.log("ping instance %s", self.get("_id"));


      var data = {
        url  : self._address() + "/info",
        json : self._instance.get()
      };


      request.post(data, function(err) {
        if(err) return ping();
        self.emit("ready");
      });
    }

    ping();
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

    if(!this.tags.findOne({ key: "owner", value: { $ne: undefined } }).sync()) return;


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
   * call this if the user is past their alloted time
   */

  "_kickUserOut": function() {
    request.post(this._address() + "/kick-user", function(req, res) {

    });
  },

  /**
   */

  "_address": function() {
    return "http://" + this._instance.get("dnsName");
  }
});
