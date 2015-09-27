import Model from "common/data/models/base/model"
import co from "co";

var PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || 
                       window.webkitRTCPeerConnection || window.msRTCPeerConnection;

var SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription ||
                       window.webkitRTCSessionDescription || window.msRTCSessionDescription


var pcSettings = {
    iceServers: [{url:'stun:stun.l.google.com:19302'}]
};

/**
 */

class Peer extends Model {

  /**
   */

  constructor(properties) { 
    super(properties);
    this.connect();
  }

  /**
   */

  connect() {

    var _this = this;

    return new Promise(function(resolve, reject) {
      var pc      = _this._pc = new PeerConnection(pcSettings);
      pc.setRemoteDescription(new SessionDescription(_this.offer), function() {
        pc.createAnswer(function(answer) {
          pc.setLocalDescription(new RTCSessionDescription(answer), co.wrap(function*() {
            resolve(yield _this._setRemoteDescription(answer));
          }), reject);
        }, reject);
      }, reject);
    });
  }

  /**
   */

  *_setRemoteDescription(answer) {
    co(function*() {

    });
  }
}

/**
 */

export default Peer;