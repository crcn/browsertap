//
//  OSXSystem.h
//  RemoteDesktop
//
//  Created by Craig Condon on 8/17/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#ifndef RemoteDesktop_OSXSystem_h
#define RemoteDesktop_OSXSystem_h

#include "./System.h"
#include <ApplicationServices/ApplicationServices.h>

class OSXSystem : System {
public:
    virtual BaseWindow* getWindows();
};

#endif
