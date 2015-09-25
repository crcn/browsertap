#ifndef DOB_H_
#define DOB_H_

#include "./core/base/application.h"
#include "./core/do/collection.h"
#include "./core/events/event_emitter.h"
#include <map>

namespace app {
  class DomainObjectBase : public core::EventEmitter, public core::EventListener {
  public:
    DomainObjectBase(base::Application* app);
    base::Application* app;
  private:
    domain::Collection* collection(std::string);
    void handleEvent(core::Event*);
    std::map<domain::Collection*,std::string> _cs;
    std::map<std::string,domain::Collection*> _sc;
  };
}
#endif