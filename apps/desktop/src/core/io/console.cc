#include "./console.h"
#include <json/json.h>
#include <iostream>
#include <pthread.h>


io::Console::Console(mesh::Bus* bus):io::Base(bus) {
  pthread_t thread;
  pthread_create (&thread, NULL, &captureStdin, this);
}

void* io::Console::captureStdin (void *ptr)
{
  while(1) {
    std::string input;
    std::cin >>input;


    Json::Value root;
    Json::Reader reader;

    if (reader.parse(input, root)) {
      std::cout << "OK" << std::endl;
    }


    std::cout << input << std::endl;
  }
} 