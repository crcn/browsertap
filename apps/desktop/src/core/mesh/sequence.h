#ifndef MESH_SEQUENCE_H_
#define MESH_SEQUENCE_H_

#include "./bus.h"
#include <vector>

namespace mesh {
  class SequenceBus : public Bus {
  public:

    /**
     */

    SequenceBus() { }

    /**
     */

    SequenceBus* add(Bus* bus) {
      this->_busses.push_back(bus);
      return this;
    }

    /**
     */

    void execute(Request* request) {
      for (int i = 0, n = this->_busses.size(); i < n; i++) {
        this->_busses.at(i)->execute(request);
      }
    }

  private:
    std::vector<Bus*> _busses;
  };
}

#endif