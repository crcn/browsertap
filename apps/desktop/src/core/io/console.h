#ifndef IO_CONSOLE_H_
#define IO_CONSOLE_H_

#include "./base.h"
#include "../../application.h"

namespace io {
  class Console : public Base {
  public:
    Console(Application* application);
    void start();
    static void* captureStdin (void*ptr);
  };
}

#endif