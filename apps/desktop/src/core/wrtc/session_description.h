#ifndef WRTC_SESSION_DESCRIPTION_H_
#define WRTC_SESSION_DESCRIPTION_H_

#include "../json/serializeable.h"
#include <stdio.h>

namespace wrtc {
  class SessionDescription : public core::IJsonSerializable  {
  public:
    std::string type;
    std::string sdp;
    SessionDescription(std::string type, std::string sdp):
    type(type),
    sdp(sdp) {

    }

    Json::Value toJson() {
      Json::Value root;
      root["type"] = type;
      root["sdp"]  = sdp;
      return root;
    }

  };
}

#endif