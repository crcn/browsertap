//
//  OSXScreen.cpp
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#include "./window.h"
#include <iostream>

osx::Window::Window(CFDictionaryRef info):
_info(info) {

    CGRect rect;

    CGRectMakeWithDictionaryRepresentation((CFDictionaryRef)CFDictionaryGetValue(info, kCGWindowBounds ), &rect);
    this->_bounds = geom::Bounds(rect.origin.x, rect.origin.y, rect.size.width, rect.size.height);
}

geom::Bounds osx::Window::bounds() {
    return this->_bounds;
};

void osx::Window::bounds(geom::Bounds bounds) {
    this->_bounds = bounds;
    // TODO - resize window here
};
