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
      this->_busses[name] = bus;
      return this;
    }

    /**
     */

    Response* execute(Request* request) {
      Bus* bus = this->_busses[request->name];
      if (bus != NULL) return bus->execute(request);
      return this->_noopBus->execute(request);
    }

  private:
    std::map<std::string, Bus*> _busses;
    Bus* _noopBus;
  };
}

#endif