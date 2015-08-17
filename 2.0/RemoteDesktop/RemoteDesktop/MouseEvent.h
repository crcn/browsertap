//
//  MouseEvent.h
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#ifndef RemoteDesktop_MouseEvent_h
#define RemoteDesktop_MouseEvent_h

#include "./HardwareEvent.h"

class MouseEvent : HardwareEvent
public:
int x;
int y;
int delta;

#endif
