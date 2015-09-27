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
#include <ApplicationServices/ApplicationServices.h>

#include "../base/window.h"

namespace osx {
    class Window : virt::Window {
    private:
        CFDictionaryRef _info;
        CGRect _cgbounds();
        geom::Bounds _convertBounds(CGRect rect);

    public:
        Window(CFDictionaryRef info);
        geom::Bounds bounds();
        graphics::Bitmap* print();
        void bounds(geom::Bounds bounds);
        std::string title();

    };
}

#endif /* defined(__RemoteDesktop__OSXScreen__) */