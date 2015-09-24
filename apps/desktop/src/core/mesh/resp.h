#ifndef MESH_RES_BUS_H_
#define MESH_RES_BUS_H_
#include "./request.h"
#include "./response.h"

namespace mesh {
  template<class ResponseClass>
  class RespBus {
  public:
    virtual Response* execute(Request* request) {
      return new ResponseClass(request);
    };
  };
}

#endif