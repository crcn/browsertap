#ifndef _RemoteDesktop_RTCConfiguration_
#define  _RemoteDesktop_RTCConfiguration_

#include "./ice_server.h"
#include <vector>

namespace rtc {
  class Configuration {
  public:
    std::vector<ICEServer> iceServers;
    Configuration(std::vector<ICEServer> iceServers):
    iceServers(iceServers) {

    }

    Configuration(ICEServer server) {
      this->iceServers.push_back(server);
    }
  };
};

#endif