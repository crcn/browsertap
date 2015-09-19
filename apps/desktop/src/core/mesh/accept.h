#ifndef MESH_ACCEPT_H_
#define MESH_ACCEPT_H_

#include "./bus.h"
#include "./request.h"
#include <functional>

namespace mesh {
  class AcceptBus : public Bus {
  public:

    /**
     */

    AcceptBus(std::function<bool(Request*)> test, Bus* yesBus, Bus* noBus):
    _test(test), _yes(yesBus), _no(noBus) {

    }

    /**
     */

    AcceptBus(std::function<bool(Request*)> test, Bus* yesBus):AcceptBus(test, yesBus, new Bus()) {

    }

    /**
     */

    virtual Response* execute(Request* request) {
      if(this->_test(request)) {
        return this->_yes->execute(request);
      } else {
        return this->_no->execute(request);
      }
    }

  private:
    Bus* _yes;
    Bus* _no;
    std::function<bool(Request*)>  _test;
  };
}

#endif