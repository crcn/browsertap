#include "./application.h"
#include "./commands/commands.h"
#include "./core/io/websockets.h"
#include <iostream>

/**
 */

app::Application::Application() {

  // message layer
  this->bus    = new mesh::Bus();

  // desktop controller
  this->desktop = new osx::Desktop();

  this->_commands = new app::Commands(this);

  // input / output to the application
  this->io     = new io::WebSockets(this);

  // domain object base
  this->ardb    = new activeRecord::DB(this);

  // TODO - this->bus = new mesh::TailableBus(this->bus);
  // TODO - this->_busLogger = new BusLogger(this->bus); // tail bus here
}

/**
 */

void app::Application::start() {
  LOG_INFO(__PRETTY_FUNCTION__);

  // hydrate the app with initial data
  mesh::Request request("hydrate");
  mesh::Response* response = this->bus->execute(&request);
  while(response->read());
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
