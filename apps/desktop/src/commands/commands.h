#ifndef COMMANDS_H_
#define COMMANDS_H_

#include "../core/base/application.h"
#include "../core/mesh/mesh.h"

namespace app {
  class Commands {
  public:
    Commands(base::Application* app);
    base::Application* app;
  };

  class AppBus  : public mesh::Bus {
  public:
    AppBus(base::Application* app):app(app) {

    }
    base::Application* app;
  };

  class PongBus : public AppBus {
  public:
    PongBus(base::Application* app):AppBus(app) { }
    mesh::Response* execute(mesh::Request* request);
  };
}

#endif