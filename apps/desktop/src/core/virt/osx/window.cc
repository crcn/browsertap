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
            kCGWindowImageNominalResolution | kCGWindowImageBoundsIgnoreFraming);
        // CGImageDestinationRef destination = CGImageDestinationCreateWithURL("~/Desktop/img.png", kUTTypePNG, 1, NULL);

        // size_t bpr = CGImageGetBytesPerRow(image);
        // size_t bpp = CGImageGetBitsPerPixel(image);
        // size_t bpc = CGImageGetBitsPerComponent(image);
        // size_t bytes_per_pixel = bpp / bpc;

        // CFDataRef bgraDataRef = CGDataProviderCopyData(CGImageGetDataProvider(image));


        CFDataRef bgraDataRef = CGDataProviderCopyData(CGImageGetDataProvider(image));


        int bgraDataLen = CFDataGetLength(bgraDataRef);

        std::cout << bgraDataLen << std::endl;
        unsigned char* bgraData = new unsigned char[bgraDataLen]; //This is what I need
        CFDataGetBytes(bgraDataRef, CFRangeMake(0, bgraDataLen), bgraData);
        // CGImageRelease(image);

        // const uint8_t* bytes = [data bytes];

        // printf("Pixel Data:\n");
        // for(size_t row = 0; row < height; row++)
        // {
        //     for(size_t col = 0; col < width; col++)
        //     {
        //         const uint8_t* pixel =
        //             &bytes[row * bpr + col * bytes_per_pixel];

        //         printf("(");
        //         for(size_t x = 0; x < bytes_per_pixel; x++)
        //         {
        //             printf("%.2X", pixel[x]);
        //             if( x < bytes_per_pixel - 1 )
        //                 printf(",");
        //         }

        //         printf(")");
        //         if( col < width - 1 )
        //             printf(", ");
        //     }

        //     printf("\n");
        // }


        CFRelease(image);

        return new graphics::Bitmap(bgraData, bgraDataLen, this->_convertBounds(rect));
    };

}