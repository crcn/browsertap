#include "./commands.h"
#include "../wrtc/connection.h"

/**
 */

app::Commands::Commands(base::Application* app):app(app) {
  LOG_INFO(__PRETTY_FUNCTION__);

  // replace the application bus with the commands bus. Note that
  // any commands that do not get executed against *registered* commands
  // here will go back to the original app bus.
  this->app->bus = (new mesh::CommandsBus(app->bus))
  ->add("getWindows", new mesh::FnBus(&this->execGetWindows))
  ->add("startMainSession", new mesh::FnBus(&this->execStartMainSession))
  ->add("startWindowSession", new mesh::FnBus(&this->execStartWindowSession));
}

/**
 * return all desktop windows
 */

mesh::Response* app::Commands::execGetWindows(mesh::Request* request) {
  return new mesh::BufferedResponse<const char*>("get windows");
}

/**
 * start a window session. Note that the session will close once the 
 * initialized session drops all connections.
 */

mesh::Response* app::Commands::execStartWindowSession(mesh::Request* request) {
  return new mesh::BufferedResponse<const char*>("start session");
}

/**
 */

mesh::Response* app::Commands::execStartMainSession(mesh::Request* request) {
  pthread_mutex_t count_mutex;

  wrtc::Connection* c = new wrtc::Connection(new mesh::FnBus([](mesh::Request* request) -> mesh::Response* {
    std::cout << "OK" << std::endl;
    return new mesh::NoResponse();
  }));
  
  // wrtc::Connection* c = 
  /*
  wrtc::Connection* c = this->app->wrtcConnections->createConnection();
  while (!c->ready()) sleep(1);
  return c->
  */

  return new mesh::BufferedResponse<const char*>("start session");
}