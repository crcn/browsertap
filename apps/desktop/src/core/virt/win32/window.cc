#include "./window.h"

namespace win32 {
  Window::Window(HWND target) {
    _target = target;
  }

  std::string Window::title() { 
		char title[1024];
		GetWindowTextA(this->_target, title, sizeof(title));
		return title;
  }

  geom::Bounds Window::bounds() {

		RECT rect;

		//http://msdn.microsoft.com/en-us/library/windows/desktop/ms633519(v=vs.85).aspx
		GetWindowRect(this->_target, &rect);
    return geom::Bounds(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
  }

  void  Window::bounds(geom::Bounds bounds) {
  }

  graphics::Bitmap* Window::print() {
    return nullptr;
  }
}
