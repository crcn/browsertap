#ifndef MESH_COMMANDS_H_
#define MESH_COMMANDS_H_

#include "./bus.h"
#include <iostream>
#include <map>

namespace mesh {
  class CommandsBus : public Bus {
  public:

    /**
     */

    CommandsBus(Bus* noopBus):_noopBus(noopBus) {

    }

    /**
     */

    CommandsBus():CommandsBus(new Bus()) {

    }

    /**
     */

    CommandsBus* add(std::string name, Bus* bus) {
      _busses[name] = bus;
      return this;
    }

    /**
     */

    Response* execute(Request* request) {
      Bus* bus = _busses[request->name];
      if (bus != nullptr) return bus->execute(request);
      return _noopBus->execute(request);
    }

  private:
    std::map<std::string, Bus*> _busses;
    Bus* _noopBus;
  };
}

#endif
