#include "./console.h"
#include <iostream>
#include <pthread.h>
#include <sstream>     

/**
 */

io::Console::Console(base::Application* app):io::Base(app) {

}

/**
 */

void io::Console::start() {
  LOG_INFO(__PRETTY_FUNCTION__);
  pthread_t thread;
  pthread_create (&thread, NULL, &captureStdin, this);
}

/**
 */

/**
 */

void* io::Console::captureStdin (void *ptr) {

  io::Console* c = (io::Console*)ptr;

  while(1) {
    std::string input;
    std::getline(std::cin, input);

    Json::Value root;
    Json::Reader reader;

    if (reader.parse(input, root)) {
      c->executeCommand(root);
    }
  }
} 

/**
 */

void io::Console::executeCommand(Json::Value& root) {

    mesh::Response* response = app->bus->execute(new mesh::Request(root["name"].asString(), (void*)&root));
    const char* chunk;

    // boundary start
    std::cout << ">>>>>>>>";

    /*
    response->read([](const char* ))
    */

    // output data  
    while(chunk = (const char*)response->read()) {
      std::cout << chunk;
    }

    // boundary end
    std::cout << "<<<<<<<<" << std::endl;
}