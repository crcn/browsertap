//
//  Screen.h
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#ifndef RemoteDesktop_BaseWindow_h
#define RemoteDesktop_BaseWindow_h

#include "./Bounds.h"

class BaseWindow {
public:
    virtual Bounds& getBounds()=0;
    virtual void setBounds(Bounds& bounds)=0;
};

#endif
