#include "./wrtc_connection.h"
#include "./virt_window.h"

namespace app {

  const char* WRTCConnection::COLLECTION_NAME = "wrtcConnections";

  WRTCConnection::WRTCConnection(wrtc::Connection* connection):_connection(connection) {
    video = NULL;
    connection->addListener(this);
  }

  bool WRTCConnection::exists() {
  }

  void WRTCConnection::handleEvent(core::Event* event) {
    // trigger update when local connection changes
    // update();
  }

  void WRTCConnection::setRemoteDescription(wrtc::SessionDescription description) {
    _connection->setRemoteDescription(description);
  }

  Json::Value WRTCConnection::toJson() {
    Json::Value root = activeRecord::Object::toJson();

    if (video) {
      root["video"]["id"] = video->id();
    }

    if (_connection->localDescription) {
      root["offer"] = _connection->localDescription->toJson();
    }

    return root;
  }
}
