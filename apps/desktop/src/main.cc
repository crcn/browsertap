//
//  main.cpp
//  RemoteDesktop
//
//  Created by Craig Condon on 8/16/15.
//  Copyright (c) 2015 browsertap. All rights reserved.
//

#include <iostream>
#include "./osx/desktop.h"
#include "./remote2/server.h"
#include "./wrtc/connection.h"
// #include "./remote/transports.h"
#include "./geom/bounds.h"
#include <json/json.h>
#include "./core/mesh/mesh.h"
#include "./application.h" 
#include "./core/thread/thread.h"
#include "./core/thread/mutex.h"
#include "./core/thread/condition.h"

class Test {
public:
  core::ThreadMutex mutex;
  core::ThreadCondition condition;
  bool ready;
};

int main(int argc, const char * argv[]) {

  app::Application* app = new app::Application();
  app->start();

  mesh::FnBus* bus = new mesh::FnBus([](mesh::Request* request) -> mesh::Response* {
    return new mesh::AsyncResponse([](mesh::AsyncResponse* response) -> void {
      response->write((void*)"chunk");
      response->write((void*)"chunk2");
      core::Thread::run((void*)response, [](void* resp) -> void* {
        mesh::AsyncResponse* response = (mesh::AsyncResponse*)resp;

        std::cout << "ENDING" << std::endl;
        response->end();
      });
      std::cout << "RUN THREAD" << std::endl;
    });
  });

  mesh::Response* response = bus->execute(new mesh::Request("blarg"));

  std::cout << "EXEC" << std::endl;
  const char* chunk;

  while(chunk = (const char*)response->read()) {
    std::cout << "CHUNK: " << chunk << std::endl;
  }

  std::cout << "END" << std::endl;
  while(1);
}



/*

void* read() {
  while(!this->ended || !this->data);
  return this->data;
}

*/