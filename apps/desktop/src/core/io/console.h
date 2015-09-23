#ifndef IO_CONSOLE_H_
#define IO_CONSOLE_H_

#include "./base.h"
#include <json/json.h>

namespace io {
  class Console : public Base {
  public:
    Console(base::Application* application);
    void start();
    static void* captureStdin (void*ptr);
    void executeCommand (Json::Value& value);
  };
}

#endif