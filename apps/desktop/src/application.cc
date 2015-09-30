#include "./application.h"
#include "./commands/commands.h"
#include "./core/io/websockets.h"
#include <iostream>

/**
 */

app::Application::Application() {

  this->bus    = new mesh::Bus();
  this->bus    = new mesh::TailableBus(this->bus);

  // desktop controller
  this->desktop = new osx::Desktop();

  // commands which can be executed against the bus
  this->_commands = new app::Commands(this);

  // input / output to the application
  this->io     = new io::WebSockets(this);

  // domain object base
  this->ardb    = new activeRecord::DB(this);

  // TODO - fix - causing seg faults
  // this->_logOperations = new app::LogOperations(this);
}

/**
 */

void app::Application::start() {
  LOG_INFO(__PRETTY_FUNCTION__);

  // hydrate the app with initial data
  mesh::Request request("hydrate");
  mesh::Response* response = this->bus->execute(&request);
  delete response;

  this->io->start();
}

/**
 */

app::Application::~Application() {
  delete this->bus;
  delete this->desktop;
  delete this->io;
  delete this->_commands;
}
