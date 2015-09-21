//
//  main.cpp
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#include <iostream>
#include "./osx/desktop.h"
// #include "./remote/server.h"
// #include "./remote/transports.h"
#include "./geom/bounds.h"
#include <json/json.h>
#include "./core/mesh/mesh.h"
#include "./application.h"

int main(int argc, const char * argv[]) {
  app::Application* app = new app::Application();
  app->start();
}
