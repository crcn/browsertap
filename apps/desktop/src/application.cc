#include "./application.h"
#include "./core/io/console.h"
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
  this->io     = new io::Console(this);
}

/**
 */

void app::Application::start() {

  LOG_INFO("app::Application::start");

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
