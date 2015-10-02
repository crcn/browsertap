#ifndef LOG_OPERATIONS_H_
#define LOG_OPERATIONS_H_

#include "../core/application/application.h"
#include "../core/thread/runnable.h"
#include "../core/mesh/mesh.h"

namespace app {
  class LogOperationsBus : public mesh::Bus {
  public:
    LogOperationsBus(mesh::Bus* bus);
    mesh::Response* execute(mesh::Request* request);
  private:
    mesh::Bus* _mainBus;
  };
};

#endif
