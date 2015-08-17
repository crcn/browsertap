//
//  main.m
//  OSXRemoteDesktop
//
//  Created by Craig Condon on 8/12/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#import <Foundation/Foundation.h>
@import AppKit;
@import CoreGraphics;

int main(int argc, const char * argv[]) {
    
    @autoreleasepool {
        
        CFArrayRef windowList = CGWindowListCopyWindowInfo(kCGWindowListOptionOnScreenOnly, kCGNullWindowID);
        
        
        NSArray* windows = (__bridge NSArray*)windowList;
        
        for (NSMutableDictionary* cfWindow in windows) {
            NSLog(@"%@", cfWindow);
            CGRect bounds;
            CGRectMakeWithDictionaryRepresentation((CFDictionaryRef)[cfWindow objectForKey:@"kCGWindowBounds"], &bounds);

            CGImageRef screenShot = CGWindowListCreateImage(bounds, kCGWindowListExcludeDesktopElements|kCGWindowListOptionIncludingWindow, cfWindow[@"kCGWindowNumber"], kCGWindowImageNominalResolution | kCGWindowImageBoundsIgnoreFraming);
            
            
            NSBitmapImageRep *bitmapRep = [[NSBitmapImageRep alloc] initWithCGImage:screenShot];
            NSData *pngData = [bitmapRep representationUsingType:NSPNGFileType properties:nil];
            NSString* fileName = [NSString stringWithFormat:@"/Users/crcn/Desktop/%d.png", cfWindow[@"kCGWindowNumber"]];
            [pngData writeToFile:fileName atomically:YES];
            
        }

        
        // This just invokes the API as you would if you wanted to grab a screen shot. The equivalent using the UI would be to
        // enable all windows, turn off "Fit Image Tightly", and then select all windows in the list.
        CGImageRef screenShot = CGWindowListCreateImage(CGRectInfinite, kCGWindowListOptionOnScreenOnly, kCGNullWindowID, kCGWindowImageDefault);
        
        NSBitmapImageRep *bitmapRep = [[NSBitmapImageRep alloc] initWithCGImage:screenShot];
        // Create an NSImage and add the bitmap rep to it...
        //NSImage *image = [[NSImage alloc] init];
        //[image addRepresentation:bitmapRep];
        //        [bitmapRep release];
        //        bitmapRep = nil;
        
//        [newRep setSize:[image size]];   // if you want the same resolution
        NSData *pngData = [bitmapRep representationUsingType:NSPNGFileType properties:nil];
        [pngData writeToFile:@"/Users/crcn/Desktop/test.png" atomically:YES];
        //[newRep autorelease];
        
        NSLog(@"boom!");
    }
    
    
    
    return 0;
}
