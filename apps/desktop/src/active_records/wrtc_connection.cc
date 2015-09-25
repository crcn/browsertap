#include "./wrtc_connection.h"

namespace app {

  const char* WRTCConnection::COLLECTION_NAME = "wrtcConnections";

  WRTCConnection::WRTCConnection() {
    
  }
  
  bool WRTCConnection::exists() {
    
  }
    
  Json::Value WRTCConnection::toJSON() {
    Json::Value root;
    return root;
  }
}