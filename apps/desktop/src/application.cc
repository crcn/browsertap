#include "./application.h"
#include "./commands/commands.h"
#include "./core/io/websockets.h"
#include "./plugins/log_operations.h"
#include <iostream>

#ifndef _MCS_VER
  #include "./core/virt/osx/desktop.h"
  typedef osx::Desktop MainDesktop;
#else
  #include "./core/virt/win32/desktop.h"
  typedef win32::Desktop MainDesktop;
#endif

/**
 */

app::Application::Application() {

  bus    = new mesh::Bus();

  // desktop controller
  desktop = new MainDesktop();

  // commands which can be executed against the bus
  _commands = new app::Commands(this);

  // input / output to the application
  io     = new io::WebSockets(this);

  // domain object base
  ardb    = new activeRecord::DB(this);

  // debugging only
  // bus     = new app::LogOperationsBus(bus);
}

/**
 */

void app::Application::start() {
  LOG_INFO(__PRETTY_FUNCTION__);

  // hydrate the app with initial data. TODO - maybe change this to startSync
  mesh::Request request("hydrate");
  mesh::Response* response = bus->execute(&request);
  delete response;

  io->start();
}

/**
 */

app::Application::~Application() {
  delete bus;
  delete desktop;
  delete io;
  delete _commands;
}
