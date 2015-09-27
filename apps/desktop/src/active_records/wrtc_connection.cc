#include "./wrtc_connection.h"
#include "./virt_window.h"

namespace app {

  const char* WRTCConnection::COLLECTION_NAME = "wrtcConnections";

  WRTCConnection::WRTCConnection(wrtc::Connection* connection):_connection(connection) {
    this->video = NULL;
  }
  
  bool WRTCConnection::exists() {
    
  }
  
  void WRTCConnection::setVideo(VirtWindow* video) {
    this->video = video;
    this->_connection->setVideo(video);
  }

  Json::Value WRTCConnection::toJson() {
    Json::Value root;

    if (this->video) {
      root["video"]["id"] = this->video->id();
    }

    // root["offer"] = this->_connection->

    return root;
  }
}