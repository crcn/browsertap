#include "./virt_window.h"

namespace app {

  const char* VirtWindow::COLLECTION_NAME = "virtWindows";

  VirtWindow::VirtWindow(virt::Window* window):_window(window) {
  }

  graphics::Bitmap* VirtWindow::print() {
    return _window->print();
  }

  // TODO - perhaps change to serializable if json::Value has
  // option
  Json::Value VirtWindow::toJson() {
    Json::Value root;
    geom::Bounds b = _window->bounds();
    root["title"]   = _window->title();
    root["id"]      = id();
    root["x"]       = b.x;
    root["y"]       = b.y;
    root["width"]   = b.width;
    root["height"]  = b.height;
    return root;
  }

  VirtWindow::~VirtWindow() {

  }
}
