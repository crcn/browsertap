#ifndef APPLICATION_H_
#define APPLICATION_H_

#include "./core/active_record/db.h"
#include "./core/application/application.h"
#include "./core/io/console.h"
#include "./core/virt/base/desktop.h"
#include "./core/thread/thread.h"

namespace app {

  class Commands;

  class Application : public base::Application {
  public:
    virt::Desktop* desktop;
    Application();
    ~Application();
    void start();
    activeRecord::DB* ardb;
  private:
    app::Commands* _commands;
  };
}

#endif
