#ifndef APPLICATION_H_
#define APPLICATION_H_

#include "./core/mesh/mesh.h"
#include "./osx/desktop.h"
#include "./core/io/base.h"

class Application {
public:
  Application();
  mesh::Bus* bus;
  base::Desktop* destop;
  io::Base* io;
};

#endif
