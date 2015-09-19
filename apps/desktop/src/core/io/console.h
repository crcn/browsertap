#ifndef IO_CONSOLE_H_
#define IO_CONSOLE_H_

#include "./base.h"

namespace io {
  class Console : public Base {
  public:
    Console(mesh::Bus* bus);
    static void* captureStdin (void*ptr);
  };
}

#endif