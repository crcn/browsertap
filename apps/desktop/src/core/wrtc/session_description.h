#ifndef WRTC_SESSION_DESCRIPTION_H_
#define WRTC_SESSION_DESCRIPTION_H_

#include <stdio.h>

namespace wrtc {
  class SessionDescription {
  public:
    std::string type;
    std::string sdp;
    SessionDescription(std::string type, std::string sdp):
    type(type),
    sdp(sdp) {

    }
    
  };
}

#endif