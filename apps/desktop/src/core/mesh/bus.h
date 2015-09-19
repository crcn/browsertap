#ifndef MESH_BUS_H_
#define MESH_BUS_H_
#include "./request.h"
#include "./response.h"

namespace mesh {
  class Bus {
  public:
    virtual Response* execute(Request* request) {
      return new NoResponse();
    };
  };
}

#endif