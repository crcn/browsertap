//
//  OSXScreen.cpp
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#include "./OSXWindow.h"
#include "./Bounds.h"

Bounds& OSXScreen::getBounds() {
    Bounds b = Bounds(0, 0, 100, 100);
    return b;
};

void OSXScreen::setBounds(Bounds& bounds) {
    
};