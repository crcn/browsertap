#ifndef MES_FN_H_
#define MES_FN_H_

#include "./bus.h"
#include <functional>

namespace mesh {
  class FnBus : public Bus {
  public:

    /**
     */

    FnBus(std::function<Response*(Request*)> execute):_execute(execute) { }

    /**
     */

    virtual Response* execute(Request* request) {
      return this->_execute(request);
    }

  private:
    std::function<Response*(Request*)> _execute;
  };
}

#endif