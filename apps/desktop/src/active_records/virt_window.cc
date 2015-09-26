#include "./virt_window.h"

namespace app {

  const char* VirtWindow::COLLECTION_NAME = "virtWindows";

  VirtWindow::VirtWindow(virt::Window* window):_window(window) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);
  }

  graphics::Bitmap* VirtWindow::print() {
    return this->_window->print();
  }
  
  bool VirtWindow::exists() {
    
  }
  
  // TODO - perhaps change to serializable if json::Value has
  // option
  Json::Value VirtWindow::toJSON() {
    Json::Value root;
    geom::Bounds b = this->_window->bounds();
    root["id"]      = this->id();
    root["x"]       = b.x;
    root["y"]       = b.y;
    root["width"]   = b.width;
    root["height"]  = b.height;
    return root;
  }

  VirtWindow::~VirtWindow() {

  }
}