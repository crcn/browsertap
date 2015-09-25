#ifndef APP_WRTC_CONNECTION_H_
#define APP_WRTC_CONNECTION_H_

#include "../core/active_record/object.h"

namespace app {
  class WRTCConnection : public activeRecord::Object {
  public:
    WRTCConnection();
    virtual bool exists();
    virtual Json::Value toJSON();
    static const char* COLLECTION_NAME;
  };
}

#endif