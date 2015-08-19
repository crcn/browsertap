#ifndef _RTC_ICE_SERVER_
#define _RTC_ICE_SERVER_

#include <vector>
#include "talk/app/webrtc/peerconnectioninterface.h"

namespace rtc {
  class IceServer : public webrtc::PeerConnectionInterface::IceServer {

  public:

    IceServer(const char* url) {
      this->uri        = url;
    }

    // IceServer(const char* url, const char* username = 0, const char* credential = 0) {
    //   this->uri        = url;
    //   this->username   = username;
    //   // this->password   = credential;
    // }
  };
};

#endif