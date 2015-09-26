#ifndef APP_VIRT_WINDOW_H_
#define APP_VIRT_WINDOW_H_

#include "../core/log/logger.h"
#include "../core/active_record/object.h"
#include "../core/virt/base/window.h"

namespace app {
  class VirtWindow : public activeRecord::Object {
  public:
    VirtWindow(virt::Window*);
    virtual bool exists();
    virtual Json::Value toJSON();
    graphics::Bitmap* print();
    static const char* COLLECTION_NAME;
    ~VirtWindow();
  private:
    virt::Window* _window;
  };
}

#endif