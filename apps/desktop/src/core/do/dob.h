#ifndef DOB_H_
#define DOB_H_

#include "../application/application.h"
#include "./collection.h"
#include "../events/event_emitter.h"
#include <map>

namespace app {
  class DomainObjectBase : public core::EventEmitter, public core::EventListener {
  public:
    DomainObjectBase(base::Application* app);
    base::Application* app;
    domain::Collection* collection(std::string);
  private:
    void handleEvent(core::Event*);
    std::map<domain::Collection*,std::string> _cs;
    std::map<std::string,domain::Collection*> _sc;
  };
}
#endif