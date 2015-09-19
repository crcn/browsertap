#include "./application.h"
#include "./core/io/console.h"
#include <iostream>

/**
 */

Application::Application() {

  // message layer
  this->bus    = new mesh::Bus();

  // desktop controller
  this->destop = new osx::Desktop();

  // input / output to the application
  this->io     = new io::Console(this);
}

/**
 */

void Application::start() {

  LOG_INFO("init application");

  this->io->start();

  // keep it alive
  while(1);
}