//
//  bounds.h
//  RemoteDesktop
//
//  Created by Craig Condon on 8/17/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#ifndef __RemoteDesktop__bounds__
#define __RemoteDesktop__bounds__

#include <stdio.h>

namespace geom {
    class Bounds {
    public:
        
        int x;
        int y;
        int width;
        int height;
        
        Bounds(int x, int y, int width, int height) {
            this->x      = x;
            this->y      = y;
            this->width  = width;
            this->height = height;
        }
    };
};

#endif /* defined(__RemoteDesktop__bounds__) */
