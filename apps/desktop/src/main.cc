//
//  main.cpp
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#include <iostream>
#include "./application.h"
#include "./core/thread/thread.h"
#include "./core/thread/mutex.h"
#include "./core/thread/condition.h"
#include <libwebsockets.h>
#include "./core/shims/shims.h"

int main(int argc, const char * argv[]) {

  app::Application* app = new app::Application();
  app->start();

  while(1) sleep(1);
}
