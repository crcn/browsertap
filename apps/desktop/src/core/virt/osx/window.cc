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

namespace osx {

    Window::Window(CFDictionaryRef info):
    _info(info) {
        this->id = _generateId();
    }

    geom::Bounds Window::bounds() {
        return this->_convertBounds(this->_cgbounds());
    };

    geom::Bounds Window::_convertBounds(CGRect rect) {
        return geom::Bounds(rect.origin.x, rect.origin.y, rect.size.width, rect.size.height);
    };

    CGRect Window::_cgbounds() {
        CGRect rect;
        CGRectMakeWithDictionaryRepresentation((CFDictionaryRef)CFDictionaryGetValue(this->_info, kCGWindowBounds), &rect);
        return rect;
    };

    void Window::bounds(geom::Bounds bounds) {
        // this->_bounds = bounds;
        // TODO - resize window here
    };

    std::string Window::title() {
        CFStringRef currentTitle = (CFStringRef)CFDictionaryGetValue(this->_info, kCGWindowName);
        const char* bytes = CFStringGetCStringPtr(currentTitle, kCFStringEncodingUTF8);
        if (bytes == NULL) return std::string();
        std::string ret(bytes);
        return ret;
    }

    graphics::Bitmap* Window::print() {
        CGRect rect = this->_cgbounds();
        int winId = 0;

        CFNumberRef windowNumber = (CFNumberRef)CFDictionaryGetValue(this->_info, kCGWindowNumber);
        CFNumberGetValue(windowNumber, kCFNumberIntType, &winId);

        // TODO vs glgrab.c
        CGImageRef image = CGWindowListCreateImage(rect,
            kCGWindowListOptionIncludingWindow,
            winId,
            kCGWindowImageDefault);

        // CFDataRef cd = CGDataProviderCopyData(CGImageGetDataProvider(image));



        int w = rect.size.width;
        int h = rect.size.height;
        int bgraDataLen = w * h * 4;

        // Alloc data that the image data will be put into
        unsigned char *rawData = new unsigned char[bgraDataLen];
        // unsigned char *rawData = (unsigned char *)CFDataGetBytePtr(cd);

        // // Create a CGBitmapContext to draw an image into
        size_t bytesPerPixel = 4;
        size_t bytesPerRow = bytesPerPixel * w;
        size_t bitsPerComponent = 8;
        CGColorSpaceRef colorSpace = CGColorSpaceCreateWithName(kCGColorSpaceGenericRGB);
        CGContextRef context = CGBitmapContextCreate(rawData, w, h,
                                                     bitsPerComponent, bytesPerRow, colorSpace,
                                                     kCGImageAlphaPremultipliedLast);
        CGColorSpaceRelease(colorSpace);

        // Draw the image which will populate rawData
        CGContextDrawImage(context, CGRectMake(0, 0, w, h), image);
        CGContextRelease(context);
        CFRelease(image);

        return new graphics::Bitmap(rawData, bgraDataLen, this->_convertBounds(rect));
    };

}