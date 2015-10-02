//
//  OSXSystem.cpp
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#include "./desktop.h"
#include "./window.h"
#include <iostream>

namespace osx {

  // TODO -
  std::vector<virt::Window*> Desktop::syncWindows() {
    CGWindowListOption listOptions = kCGWindowListOptionOnScreenOnly | kCGWindowListExcludeDesktopElements;

    CFArrayRef cfWindows = CGWindowListCopyWindowInfo(listOptions, kCGNullWindowID);
    int numWindows    = CFArrayGetCount(cfWindows);

    std::vector<uint32_t> existingWindowIds;
    std::vector<virt::Window*> windows;

    for (int i = 0, n = numWindows; i < n; i++) {

      CFDictionaryRef info = (CFDictionaryRef)CFArrayGetValueAtIndex(cfWindows, i);
      CFNumberRef windowNumber = (CFNumberRef)CFDictionaryGetValue(info, kCGWindowNumber);
      uint32_t winId = 0;
      CFNumberGetValue(windowNumber, kCFNumberIntType, &winId);

      virt::Window* window = _windows[winId];

      // create the window only if it needs to be created
      if (window == nullptr) {
        _windows[winId] = window = (virt::Window*)new osx::Window(winId);
      }

      windows.push_back(window);
      existingWindowIds.push_back(winId);
    }

    CFRelease(cfWindows);

    std::vector<uint32_t> toDelete;

    for(std::map<uint32_t, virt::Window*>::iterator iter = _windows.begin(); iter != _windows.end(); ++iter) {
      uint32_t k      = iter->first;
      virt::Window* v = iter->second;

      // no longer exists
      if(std::find(existingWindowIds.begin(), existingWindowIds.end(), k) == existingWindowIds.end()) {
        toDelete.push_back(k);
      }
    }

    if (toDelete.size() > 0)
    for (int i = toDelete.size() - 1; i--;) {
      uint32_t k = toDelete.at(i);
      virt::Window* v = _windows[k];
      _windows.erase(k);
      v->emit(virt::WindowEvents::REMOVE, NULL);
      this->emit(virt::WindowEvents::REMOVE, v);
      delete v;
    }

    return windows;
  }
}
