#ifndef COMMANDS_H_
#define COMMANDS_H_

#include "../core/base/application.h"
#include "../core/mesh/mesh.h"

namespace app {

  /**
   */

  class AppBus  : public mesh::Bus {
  public:
    AppBus(base::Application* app):app(app) {

    }
    base::Application* app;
  };

  /**
   */

  class AppFnBus : public AppBus {
  public:
    AppFnBus(base::Application* app, mesh::Response* (*execute)(mesh::Request*)):AppBus(app),_execute(execute) {

    }
    virtual mesh::Response* execute(mesh::Request* request) {
      return this->_execute(request);
    }
  private:
    mesh::Response* (*_execute)(mesh::Request*);
  };

  /**
   */

  class Commands {
  public:
    Commands(base::Application* app);
    base::Application* app;

    /**
     * returns all the windows running on the host machine
     */

    static mesh::Response* execGetWindows(mesh::Request* request);

    /**
     * starts a new window webRTC session
     */

    static mesh::Response* execStartWindowSession(mesh::Request* request);

  };
}

#endif