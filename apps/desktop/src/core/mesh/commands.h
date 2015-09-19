#ifndef MESH_COMMANDS_H_
#define MESH_COMMANDS_H_

#include "./bus.h"
#include <map>

namespace mesh {
  class CommandsBus : public Bus {
  public:

    /**
     */

    CommandsBus() { }

    /**
     */

    CommandsBus* add(std::string name, Bus* bus) {
      this->_busses[name] = bus;
      return this;
    }

    /**
     */

    void execute(Request* request) {
      Bus* bus = this->_busses[request->name];
      if (bus != NULL) bus->execute(request);
    }

  private:
    std::map<std::string, Bus*> _busses;
  };
}

#endif