#include "./wrtc_connection.h"
#include "./virt_window.h"

namespace app {

  const char* WRTCConnection::COLLECTION_NAME = "wrtcConnections";

  WRTCConnection::WRTCConnection(wrtc::Connection* connection):_connection(connection) {
    this->window = NULL;
  }
  
  bool WRTCConnection::exists() {
    
  }
  
  void WRTCConnection::setWindow(VirtWindow* window) {
    this->window = window;
  }

  Json::Value WRTCConnection::toJSON() {
    Json::Value root;
    root["window"]["id"] = this->window->id();
    return root;
  }
}