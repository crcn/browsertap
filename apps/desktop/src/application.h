#ifndef APPLICATION_H_
#define APPLICATION_H_

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
  private:
    app::Commands* _commands;
  };
}

#endif
