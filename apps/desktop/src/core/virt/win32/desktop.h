//
//  OSXSystem.h
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#ifndef __RemoteDesktop__WinSystem__
#define __RemoteDesktop__WinSystem__

#include <Windows.h>
#include <vector>
#include <map>
#include "../base/desktop.h"
#include "./window.h"

namespace win32 {
  class Desktop : public virt::Desktop  {
  public:
      Desktop();
      std::vector<virt::Window*> syncWindows();
      void _getWindows();
      static BOOL CALLBACK _eachWindow(HWND hWnd, LPARAM lParam);
      BOOL CALLBACK _eachWindow(HWND hWnd);
  private:
    std::map<HWND, win32::Window*> _windows;
  };
};


#endif /* defined(__RemoteDesktop__OSXSystem__) */
