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
        // insert code here...
        NSLog(@"Hello, World!");
    }
    
    int i = 0;
    for(NSScreen* screen in [NSScreen screens]) {
        NSDictionary* screenDictionary = [screen deviceDescription];
        NSNumber* screenID = [screenDictionary objectForKey:@"NSScreenNumber"];
        CGDirectDisplayID aID = [screenID unsignedIntValue];
        NSLog(@"Screen number %i is%@ builtin", i, CGDisplayIsBuiltin(aID)? @"": @" not");
        i++;
    }
    
    
    return 0;
}
