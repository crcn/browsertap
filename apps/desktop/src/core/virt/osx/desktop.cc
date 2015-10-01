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


std::vector<virt::Window*> osx::Desktop::windows() {
    CGWindowListOption listOptions = kCGWindowListOptionOnScreenOnly | kCGWindowListExcludeDesktopElements;

    CFArrayRef windows = CGWindowListCopyWindowInfo(listOptions, kCGNullWindowID);
    int numWindows    = CFArrayGetCount(windows);

    for (int i = 0, n = numWindows; i < n; i++) {

        CFDictionaryRef info = (CFDictionaryRef)CFArrayGetValueAtIndex(windows, i);
        CFNumberRef windowNumber = (CFNumberRef)CFDictionaryGetValue(info, kCGWindowNumber);
        uint32_t winId = 0;
        CFNumberGetValue(windowNumber, kCFNumberIntType, &winId);
        this->_windows.push_back((virt::Window*)new osx::Window(winId));
    }

    // CFRelease(windows);

    return this->_windows;
}
