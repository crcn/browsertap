//
//  main.cpp
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#include <iostream>
//#include "./OSXSystem.h"
#include "./base/bounds.h"

int main(int argc, const char * argv[]) {
    
    //OSXSystem* sys = new OSXSystem();
    //BaseWindow* screens = sys->getWindows();
    
//    if (screens != NULL) {
//        std::cout << "BLAH" << std::endl;
//    }

    Bounds b = Bounds(100, 0, 100, 100);

    std::cout << b.x << std::endl;

    std::cout << "Hello World" << std::endl;
    
    return 0;
}
