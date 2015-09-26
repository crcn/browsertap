#include "./commands.h"
#include "../core/wrtc/connection.h"
#include "../active_records/wrtc_connection.h"
#include "./main_session_response.h"

namespace app {

  /**
   */

  Commands::Commands(Application* app):app(app) {
    LOG_INFO(__PRETTY_FUNCTION__);

    // replace the application bus with the commands bus. Note that
    // any commands that do not get executed against *registered* commands
    // here will go back to the original app bus.
    this->app->bus = (new mesh::CommandsBus(app->bus))
    ->add("ping", new mesh::FnBus(&this->execPong))
    ->add("hydrate", new AppFnBus(app, &this->execHydrate))
    ->add("getWindows", new mesh::FnBus(&this->execGetWindows))
    ;
  }

  /**
   * return all desktop windows
   */

  mesh::Response* Commands::execHydrate(mesh::Request* request, Application* app) {
    LOG_VERBOSE(__PRETTY_FUNCTION__);

    LOG_INFO("starting main session");

    // start the webrtc main session
    MainSessionResponse mainSessionResponse(app);
    while(mainSessionResponse.read());

    LOG_INFO("starting window watcher");

    return new mesh::NoResponse();
  }

  /**
   * simple pong response
   */

  mesh::Response* Commands::execPong(mesh::Request* request) {
    return new mesh::BufferedResponse<const char*>("pong");
  }

  /**
   * return all desktop windows
   */

  mesh::Response* Commands::execGetWindows(mesh::Request* request) {
    return new mesh::BufferedResponse<const char*>("get windows");
  }

  /**
   * start a window session. Note that the session will close once the 
   * initialized session drops all connections.
   */

  mesh::Response* Commands::execStartWindowSession(mesh::Request* request) {
    return new mesh::BufferedResponse<const char*>("start session");
  }

  /**
   */
}