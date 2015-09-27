#ifndef APP_WRTC_CONNECTION_H_
#define APP_WRTC_CONNECTION_H_

#include "../core/active_record/object.h"
#include "../core/graphics/printable.h"
#include "../core/wrtc/connection.h"
#include "./virt_window.h"

namespace app {
  class WRTCConnection : public activeRecord::Object, public core::EventListener {
  public:
    VirtWindow* video;
    WRTCConnection(wrtc::Connection*);
    virtual bool exists();
    virtual Json::Value toJson();
    virtual void setVideo(VirtWindow*);
    void handleEvent(core::Event*);
    void setRemoteDescription(wrtc::SessionDescription);
    static const char* COLLECTION_NAME;
  private:
    wrtc::Connection* _connection;
  };
}

#endif