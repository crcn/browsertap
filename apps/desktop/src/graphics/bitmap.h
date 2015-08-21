//
//  bounds.h
//  RemoteDesktop
//
//  Created by Craig Condon on 8/17/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#ifndef __RemoteDesktop__bitmap__
#define __RemoteDesktop__bitmap__

#include <stdio.h>
#include "../geom/bounds.h"

namespace graphics {
    class Bitmap {
    public:

        const char* data;
        geom::Bounds bounds;

        Bitmap(const char *data, geom::Bounds bounds):
        data(data),
        bounds(bounds) {
        }
    };
};

#endif