#ifndef MESH_REQUEST_H_
#define MESH_REQUEST_H_

#include "./bus.h"
#include <vector>
#include <iostream>

namespace mesh {
  class Request {
  public:
    std::string name;
    void* data;

    /**
     */

    Request(std::string name, void* data):
    name(name),
    data(data) {
    }

    /**
     */

    Request(std::string name):Request(name, NULL) {

    }
  };
}

#endif
