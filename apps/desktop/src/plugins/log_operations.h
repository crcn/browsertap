#ifndef LOG_OPERATIONS_H_
#define LOG_OPERATIONS_H_

#include "../core/application/application.h"
#include "../core/thread/runnable.h"

namespace app {
  class LogOperations : public core::Runnable {
  public:
    LogOperations(base::Application* app);
    void* run();
    base::Application* app;
    mesh::Response* _tail;
  };
};

#endif