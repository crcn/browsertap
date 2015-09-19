#ifndef MESH_REQUEST_H_
#define MESH_REQUEST_H_

#include "./bus.h"
#include <vector>
#include <iostream>

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