//
//  main.cpp
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#include <iostream>
#include "./osx/system.h"
#include "./geom/bounds.h"

int main(int argc, const char * argv[]) {
    
    osx::System* sys = new osx::System();

    base::Window* wins = sys->getWindows();

    std::cout << sizeof(wins) << std::endl;
    //BaseWindow* screens = sys->getWindows();
    
//    if (screens != NULL) {
//        std::cout << "BLAH" << std::endl;
//    }

    geom::Bounds b = geom::Bounds(100, 0, 100, 100);

    std::cout << b.x << std::endl;

    std::cout << "Hello World" << std::endl;
    
    return 0;
}
