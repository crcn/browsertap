#include "./peer_connection.h"
#include <stdio.h>
#include <iostream>

rtc::PeerConnection::PeerConnection(rtc::Configuration config):
_config(config) {
  _factory = webrtc::CreatePeerConnectionFactory();
}