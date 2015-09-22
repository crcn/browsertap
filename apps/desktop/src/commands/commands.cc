#include "./commands.h"

/**
 */

app::Commands::Commands(base::Application* app):app(app) {
  LOG_INFO("app::Commands::Commands");

  // replace the application bus with the commands bus. Note that
  // any commands that do not get executed against *registered* commands
  // here will go back to the original app bus.
  this->app->bus = (new mesh::CommandsBus(app->bus))
  ->add("getWindows", new mesh::FnBus(&this->execGetWindows))
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