#include "./application.h"
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

  this->_dob   = new app::DomainObjectBase(this);

}

/**
 */

void app::Application::start() {
  LOG_INFO(__PRETTY_FUNCTION__);
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
