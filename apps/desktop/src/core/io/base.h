#ifndef IO_BASE_H_
#define IO_BASE_H_

#include "../mesh/mesh.h"

namespace io {
  class Base {
  public:
    Base(mesh::Bus* bus):bus(bus) {};
    mesh::Bus* bus;
  };
}

#endif