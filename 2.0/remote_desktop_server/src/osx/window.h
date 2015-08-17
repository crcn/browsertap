//
//  OSXScreen.h
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#ifndef __RemoteDesktop__OSXScreen__
#define __RemoteDesktop__OSXScreen__

#include <stdio.h>
#include "./BaseWindow.h"
#include "./Bounds.h"

class OSXScreen : BaseWindow {
public:
    Bounds& getBounds();
    void setBounds(Bounds& bounds);
};

#endif /* defined(__RemoteDesktop__OSXScreen__) */
