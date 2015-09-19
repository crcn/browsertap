#include "./console.h"
#include <json/json.h>
#include <iostream>
#include <pthread.h>

/**
 */

io::Console::Console(Application* app):io::Base(app) {
}

/**
 */

void io::Console::start() {
  LOG_INFO("init console IO transport");
  pthread_t thread;
  pthread_create (&thread, NULL, &captureStdin, this);
}

/**
 */

void* io::Console::captureStdin (void *ptr)
{

  io::Console* c = (io::Console*)ptr;

  while(1) {
    std::string input;
    std::cin >>input;

    Json::Value root;
    Json::Reader reader;

    if (reader.parse(input, root)) {
      c->app->bus->execute(new mesh::Request(root["name"].asString()));
    }

    std::cout << input << std::endl;
  }
} 