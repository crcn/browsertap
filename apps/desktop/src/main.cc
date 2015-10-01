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

#include "./core/thread/manager.h"

core::ThreadMutex _mutex;
core::TaskManager tm;

void* run(void* arg) {
  _mutex.lock();
  int* i  = (int*)arg;
  int& aa = *i;
  aa++;
  _mutex.unlock();
}

void* run2(void* arg) {
  tm.run(new core::FnTask(arg, &run));
}

int main(int argc, const char * argv[]) {

  int a = 0;

  // for (int j = 100; j--;) {
  //   tm.run(new core::FnTask(&a, &run2));
  // }

  for(int i = 10; i--;) {
    for (int j = 100; j--;) {
      tm.run(new core::FnTask(&a, &run));
    }
    usleep(1);
  }

  usleep(1000 * 100 );

  std::cout << "a: " << a << std::endl;

  while(1) sleep(1);


  // app::Application* app = new app::Application();
  // app->start();

  // while(1) sleep(1);
}
