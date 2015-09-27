import SockJS from "sockjs-client";


/**
 */

class Connection {
  constructor() {

  }
  connect(host) { 

    var sock = new SockJS(host + "/echo");
     sock.onopen = function() {
         console.log('open');
     };
     sock.onmessage = function(e) {
         console.log('message', e.data);
     };
     sock.onclose = function() {
         // console.log('close');
     };
  }
}

/**
 */

export default Connection;
