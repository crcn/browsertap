#ifndef _EVENT_EMITTER_
#define _EVENT_EMITTER_

#include <vector>
#include "./event_listener.h"
#include "./event.h"

namespace core {
  class EventEmitter {
  public:
    void emit(int event, void* data);
    void emit(Event* event);
    void addListener(EventListener* listener);
  private:
    std::vector<EventListener*> _listeners;
    // void dispatchEvents();
  };
};

#endif