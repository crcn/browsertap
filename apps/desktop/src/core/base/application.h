#ifndef BASE_APPLICATION_H_
#define BASE_APPLICATION_H_

#include "../log/logger.h"
#include "../mesh/mesh.h"

namespace io {
  class Base;
}

namespace base {
  class Application {
  public:
    mesh::Bus* bus;
    io::Base* io;

    Application() { };
    virtual void start()=0;
  };
}

#endif
