#ifndef MESH_REJECT_H_
#define MESH_REJECT_H_

#include "./accept.h"
#include <functional>

namespace mesh {
  class RejectBus : public AcceptBus {
  public:

    /**
     */

    RejectBus(std::function<bool(Request*)> test, Bus* yesBus, Bus* noBus):
    AcceptBus(test, noBus, yesBus) { }
  };
}

#endif