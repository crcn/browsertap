#ifndef MESH_TAILABLE_H_
#define MESH_TAILABLE_H_

#include "./response.h"
#include "./bus.h"
#include <vector>

namespace mesh {
  class TailableBus : public Bus {
  public:
    Bus* bus;
    std::vector<AsyncResponse*> _tails;

    TailableBus(Bus* bus):bus(bus) {

    }

    Response* execute(Request* request) {
      if (request->name.compare("tail") == 0) {
        AsyncResponse* response = new AsyncResponse();
        _tails.push_back(response);
        return response;
      } else {

        for(int i = 0, n = _tails.size(); i < n; i++) {
          _tails.at(i)->write(request);
        }

        return this->bus->execute(request);
      }
    }
  private:
    core::ThreadMutex _mutex;
  };
}

#endif