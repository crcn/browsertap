#include "./peer_connection.h"
#include <stdio.h>
#include <iostream>

rtc::PeerConnection::PeerConnection(rtc::Configuration config):
_config(config),
_socket(NULL) {

  _peer    = new rtc::RefCountedObject<PeerConnectionObserver>(this);
  _factory = webrtc::CreatePeerConnectionFactory();
}

void rtc::PeerConnection::addStream(rtc::scoped_refptr<webrtc::MediaStreamInterface> mediaStream) {
  socket()->AddStream(mediaStream);
}

webrtc::PeerConnectionInterface* rtc::PeerConnection::socket() {

  if (!_socket.get()) {
    if (_factory.get()) {
      _socket = _factory->CreatePeerConnection(_config.iceServers, _constraints, NULL, NULL, _peer.get());
    }
  }

  return _socket.get();
}