#ifndef IO_BASE_H_
#define IO_BASE_H_

class Application;
#include "../mesh/mesh.h"

namespace io {
  class Base {
  public:
    Application* app;
    Base(Application* app):app(app) { };
    virtual void start() { };
  };
}

#endif