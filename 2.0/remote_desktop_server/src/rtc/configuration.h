#ifndef _RemoteDesktop_RTCConfiguration_
#define  _RemoteDesktop_RTCConfiguration_

#include "./ice_server.h"

namespace rtc {
  class Configuration {
  public:
    webrtc::PeerConnectionInterface::IceServers iceServers;

    Configuration(webrtc::PeerConnectionInterface::IceServers iceServers):
    iceServers(iceServers) {

    }

    Configuration(IceServer server) {
      this->iceServers.push_back(server);
    }
  };
};

#endif