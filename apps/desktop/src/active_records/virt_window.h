#ifndef APP_VIRT_WINDOW_H_
#define APP_VIRT_WINDOW_H_

#include "../core/log/logger.h"
#include "../core/active_record/object.h"
#include "../core/virt/base/window.h"
#include "../core/graphics/printable.h"

namespace app {
  class VirtWindow : public activeRecord::Object, public graphics::Printable {
  public:
    VirtWindow(virt::Window*);
    virtual Json::Value toJson();
    graphics::Bitmap* print();
    static const char* COLLECTION_NAME;
    ~VirtWindow();
  private:
    virt::Window* _window;
  };
}

#endif
