#ifndef MESH_BUS_H_
#define MESH_BUS_H_
#include "./request.h"

namespace mesh {
  class Bus {
  public:
    virtual void execute(Request* request) { };
  };
}

#endif