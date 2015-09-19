#ifndef MESH_REJECT_H_
#define MESH_REJECT_H_

#include "./accept.h"

namespace mesh {
  class RejectBus : public AcceptBus {
  public:

    /**
     */

    RejectBus(bool (*test)(Request*), Bus* yesBus, Bus* noBus):
    AcceptBus(test, noBus, yesBus) { }
  };
}

#endif