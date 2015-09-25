#ifndef DOB_H_
#define DOB_H_

#include "../application/application.h"
#include "./collection.h"
#include "../events/event_emitter.h"
#include <map>

namespace activeRecord {
  class DB : public core::EventEmitter, public core::EventListener {
  public:
    DB(base::Application* app);
    base::Application* app;
    Collection* collection(std::string);
  private:
    void handleEvent(core::Event*);
    std::map<std::string, Collection*> _sc;
  };
}
#endif