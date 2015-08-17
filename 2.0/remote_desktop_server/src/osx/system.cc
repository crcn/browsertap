//
//  OSXSystem.cpp
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#include "./system.h"
#include "./window.h"
#include <iostream>


std::vector<base::Window*> osx::System::windows() {
    CFArrayRef windows = CGWindowListCopyWindowInfo(kCGWindowListOptionOnScreenOnly, kCGNullWindowID);
    int numWindows    = CFArrayGetCount(windows);

    for (int i = 0, n = numWindows; i < n; i++) {
        CFDictionaryRef info = (CFDictionaryRef)CFArrayGetValueAtIndex(windows, i);
        this->_windows.push_back((base::Window*)new osx::Window(info));
    }

    return this->_windows;
}
