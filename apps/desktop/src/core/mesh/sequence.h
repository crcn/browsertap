#ifndef MESH_SEQUENCE_H_
#define MESH_SEQUENCE_H_

#include "./bus.h"
#include "./response.h"
#include <vector>

namespace mesh {

  class SequenceBusResponse : public Response {
  public:
    SequenceBusResponse(std::vector<Response*> responses):_responses(responses),_current(0) {

    }
    void* read() {
      if (_current == _responses.size()) return NULL;
      Response* current = _responses.at(_current);
      void* chunk = current->read();

      if (chunk == NULL) {
        _current++;
        delete current; // clean up
        return read();
      } else {
        return chunk;
      }

    }
  private:
    std::vector<Response*> _responses;
    int _current;
  };


  class SequenceBus : public Bus {
  public:

    /**
     */

    SequenceBus() { }

    /**
     */

    SequenceBus* add(Bus* bus) {
      _busses.push_back(bus);
      return this;
    }

    /**
     */

    Response* execute(Request* request) {
      
      std::vector<Response*> responses;

      for (int i = 0, n = _busses.size(); i < n; i++) {
        responses.push_back(_busses.at(i)->execute(request));
      }

      return new SequenceBusResponse(responses);
    }

  private:
    std::vector<Bus*> _busses;
  };
}

#endif