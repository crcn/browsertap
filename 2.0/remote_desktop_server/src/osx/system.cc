//
//  OSXSystem.cpp
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#include "./system.h"
#include <iostream>


base::Window* osx::System::getWindows() {
    CFArrayRef windows = CGWindowListCopyWindowInfo(kCGWindowListOptionOnScreenOnly, kCGNullWindowID);
    long numWindows    = CFArrayGetCount(windows);

    

    return NULL;
}
