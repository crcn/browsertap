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

      pc.onaddstream    = _this._onAddStream.bind(_this);
      pc.onicecandidate = _this._onIceCandidate.bind(_this);

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
    var result = yield this.bus({ name: "setRemoteAnswer", answer: {
      type: answer.type,
      sdp : answer.sdp
    }, query: { id: this.id }}).read();

    console.log(result);
  }

  /**
   */

  _onAddStream(event) { 
    this.setProperties({
      videoUrl: URL.createObjectURL(event.stream)
    })
  }

  /**
   */

  _onIceCandidate(event) {

  }
}

/**
 */

export default Peer;