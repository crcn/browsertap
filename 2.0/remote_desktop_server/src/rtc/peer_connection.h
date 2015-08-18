#ifndef _RTC_PEER_CONNECTION_
#define _RTC_PEER_CONNECTION_

#include "./configuration.h"
#include "talk/app/webrtc/videosourceinterface.h"
#include "talk/app/webrtc/peerconnectionfactoryproxy.h"
#include "talk/app/webrtc/proxy.h"

namespace rtc {
  class PeerConnection {

  private:
    Configuration _config;
    rtc::scoped_refptr<webrtc::PeerConnectionFactoryInterface> _factory;

  public:
    PeerConnection(Configuration config);
  };
};

#endif