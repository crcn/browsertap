//
//  OSXScreen.cpp
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#include "./window.h"

geom::Bounds osx::Window::getBounds() {
    geom::Bounds b = geom::Bounds(0, 0, 100, 100);
    return b;
};

void osx::Window::setBounds(geom::Bounds bounds) {
    
};