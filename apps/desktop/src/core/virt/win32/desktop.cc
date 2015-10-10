#include "./desktop.h"
#include "./window.h"

namespace win32 {
  Desktop::Desktop() {

  }

  std::vector<virt::Window*> Desktop::syncWindows() {
    this->_getWindows();
    std::vector<virt::Window*> windows;

    for(std::map<HWND, win32::Window*>::iterator iter = _windows.begin(); iter != _windows.end(); ++iter) {
      HWND k           = iter->first;
      win32::Window* v = iter->second;
      windows.push_back(v);
    }

    return windows;
  }

  void Desktop::_getWindows() {
		EnumWindows(_eachWindow, (LPARAM)this);
  }

  BOOL CALLBACK Desktop::_eachWindow(HWND hWnd, LPARAM lParam) {
      Desktop* _this = (Desktop*)lParam;
      return _this->_eachWindow(hWnd);
  }

  BOOL CALLBACK Desktop::_eachWindow(HWND hWnd) {

  		if(!IsWindowVisible(hWnd)) return TRUE;

      // it's not new
      if (_windows[hWnd] != nullptr) {
        return TRUE;
      }

      Window* _win = _windows[hWnd] = new Window(hWnd);

      std::vector<HWND> toDelete;

      for(std::map<HWND, win32::Window*>::iterator iter = _windows.begin(); iter != _windows.end(); ++iter) {
        HWND k           = iter->first;

        if (!IsWindow(k)) {
          toDelete.push_back(k);
        }
      }

      for (int i = toDelete.size(); i--;) {
        HWND k = toDelete.at(i);
        win32::Window* v = _windows[k];
        _windows.erase(k);
        delete v;
      }

      return TRUE;
  }
}
