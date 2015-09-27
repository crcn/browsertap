#include "./wrtc_connection.h"
#include "./virt_window.h"

namespace app {

  const char* WRTCConnection::COLLECTION_NAME = "wrtcConnections";

  WRTCConnection::WRTCConnection(wrtc::Connection* connection):_connection(connection) {
    this->video = NULL;
    connection->addListener(this);
  }
  
  bool WRTCConnection::exists() {
  }

  void WRTCConnection::handleEvent(core::Event* event) {
    // trigger update when local connection changes
    // this->update();
  }
  
  void WRTCConnection::setVideo(VirtWindow* video) {
    this->video = video;
    this->_connection->setVideo(video);
  }

  Json::Value WRTCConnection::toJson() {
    Json::Value root = activeRecord::Object::toJson();

    if (this->video) {
      root["video"]["id"] = this->video->id();
    }

    if (this->_connection->localDescription) {
      root["offer"] = this->_connection->localDescription->toJson();
    }

    return root;
  }
}