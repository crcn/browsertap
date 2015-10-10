#ifndef _VIRT_WIN32_WINDOW_H_
#define _VIRT_WIN32_WINDOW_H_

#include <windows.h>
#include "../base/window.h"

namespace win32 {
  class Window : public virt::Window {
  public:
    Window(HWND _target);
    graphics::Bitmap* print();
    geom::Bounds bounds();
    void bounds(geom::Bounds bounds);
    std::string title();
  private:
    HWND _target;
  };
}
#endif
