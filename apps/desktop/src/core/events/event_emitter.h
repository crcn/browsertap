#ifndef _EVENT_EMITTER_
#define _EVENT_EMITTER_

#include <vector>
#include "./event_listener.h"
#include "./event.h"

namespace core {
  class EventEmitter {
  public:
    EventEmitter();
    virtual void emit(int event, void* data);
    void emit(Event* event);
    void addListener(EventListener* listener);
    void removeListener(EventListener* listener);
  private:
    std::vector<EventListener*> _listeners;
    // void dispatchEvents();
  };
};

#endif