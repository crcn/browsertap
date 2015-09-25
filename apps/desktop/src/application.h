#ifndef APPLICATION_H_
#define APPLICATION_H_

#include "./core/do/dob.h"
#include "./core/application/application.h"
#include "./commands/commands.h"
#include "./core/io/console.h"
#include "./core/virt/osx/desktop.h"

namespace app {
  class Application : public base::Application {
  public:
    base::Desktop* desktop;
    Application();
    ~Application();
    void start();
    app::DomainObjectBase* dob;
  private:
    app::Commands* _commands;
  };
}

#endif
