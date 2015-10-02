#ifndef MESH_FN_H_
#define MESH_FN_H_

#include "./bus.h"

namespace mesh {
  class FnBus : public Bus {
  public:

    /**
     */

    FnBus(Response* (*execute)(Request*)):_execute(execute) { }

    /**
     */

    virtual Response* execute(Request* request) {
      return _execute(request);
    }

  private:
    Response* (*_execute)(Request*);
  };
}

#endif