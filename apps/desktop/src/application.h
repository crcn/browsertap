#ifndef APPLICATION_H_
#define APPLICATION_H_

#include "./core/log/logger.h"
#include "./core/mesh/mesh.h"
#include "./osx/desktop.h"
#include "./core/io/base.h"

class Application {
public:
  mesh::Bus* bus;
  base::Desktop* destop;
  io::Base* io;

  Application();
  void start();
};

#endif
