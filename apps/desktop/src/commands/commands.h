#ifndef COMMANDS_H_
#define COMMANDS_H_

#include "../application.h"
#include "../core/mesh/mesh.h"
#include "../core/events/event_listener.h"

namespace app {

  /**
   */

  class AppBus  : public mesh::Bus {
  public:
    AppBus(Application* app):app(app) {

    }
    Application* app;
  };

  /**
   */

  class AppFnBus : public AppBus {
  public:
    AppFnBus(Application* app, mesh::Response* (*execute)(mesh::Request*, Application* app)):AppBus(app),_execute(execute) {

    }
    virtual mesh::Response* execute(mesh::Request* request) {
      return _execute(request, app);
    }
  private:
    mesh::Response* (*_execute)(mesh::Request*, Application*);
  };

  /**
   */

  class Commands {
  public:
    Commands(Application* app);
    Application* app;

    /**
     * returns all the windows running on the host machine
     */

    static mesh::Response* execHydrate(mesh::Request* request, Application* app);

    /**
     * returns all the windows running on the host machine
     */

    static mesh::Response* execPong(mesh::Request* request);


    /**
     * returns all the windows running on the host machine
     */

    static mesh::Response* execGetWindows(mesh::Request* request);

    /**
     * starts a new window webRTC session
     */

    static mesh::Response* execStartWindowSession(mesh::Request* request, Application* app);

    /**
     * execute ardb find
     */

    static mesh::Response* execSetRemoteAnswer(mesh::Request* request, Application* app);

    /**
     * execute ardb find
     */

    static mesh::Response* execFind(mesh::Request* request, Application* app);
  };
}

#endif