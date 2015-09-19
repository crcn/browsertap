#ifndef MESH_OPERATION_H_
#define MESH_OPERATION_H_

#include "./bus.h"
#include <vector>

namespace mesh {
  class Request {
  public:
    std::string name;

    /**
     */

    Request(std::string name) {
      this->name = name;
    }
  };
}

#endif