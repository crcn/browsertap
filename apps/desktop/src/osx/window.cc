//
//  OSXScreen.cpp
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

// ref: https://github.com/stevschmid/track-o-bot/blob/master/src/OSXWindowCapture.cpp

#include "./window.h"
#include <iostream>

int _id;

int _generateId() {
    _id++;
    return _id;
}

osx::Window::Window(CFDictionaryRef info):
_info(info) {
    this->id = _generateId();
}

geom::Bounds osx::Window::bounds() {
    return this->_convertBounds(this->_cgbounds());
};

geom::Bounds osx::Window::_convertBounds(CGRect rect) {
    return geom::Bounds(rect.origin.x, rect.origin.y, rect.size.width, rect.size.height);
};

CGRect osx::Window::_cgbounds() {
    CGRect rect;
    CGRectMakeWithDictionaryRepresentation((CFDictionaryRef)CFDictionaryGetValue(this->_info, kCGWindowBounds), &rect);
    return rect;
};

void osx::Window::bounds(geom::Bounds bounds) {
    // this->_bounds = bounds;
    // TODO - resize window here
};

graphics::Bitmap* osx::Window::print() {
    CGRect rect = this->_cgbounds();
    int winId = 0;

    CFNumberRef windowNumber = (CFNumberRef)CFDictionaryGetValue(this->_info, kCGWindowNumber);
    CFNumberGetValue(windowNumber, kCFNumberIntType, &winId);

    CGImageRef image = CGWindowListCreateImage(rect,
        kCGWindowListOptionIncludingWindow,
        winId,
        kCGWindowImageNominalResolution | kCGWindowImageBoundsIgnoreFraming);

    CFRelease(image);

    return new graphics::Bitmap(NULL, this->_convertBounds(rect));
};
