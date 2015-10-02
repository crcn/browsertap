#ifndef IO_BASE_H_
#define IO_BASE_H_

#include "../application/application.h"
#include "../mesh/mesh.h"


namespace io {
  class Base {
  public:
    base::Application* app;
    mesh::Bus* bus;
    Base(base::Application* app):app(app) { };
    virtual void start() { };
  };
}

#endif
