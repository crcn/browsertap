#ifndef APPLICATION_H_
#define APPLICATION_H_

#include "./dob.h"
#include "./core/base/application.h"
#include "./commands/commands.h"
#include "./core/io/console.h"
#include "./osx/desktop.h"

namespace app {
  class Application : public base::Application {
  public:
    base::Desktop* desktop;
    Application();
    ~Application();
    void start();
    domain::Collection* webrtcConnections;
    domain::Collection* windows;
  private:
    app::Commands* _commands;
    app::DomainObjectBase* _dob;
  };
}

#endif
