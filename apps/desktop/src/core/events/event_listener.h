#ifndef _EVENT_LISTENER_
#define _EVENT_LISTENER_

#include "./event.h"

namespace core {
  class EventListener {
  public:
    virtual void handleEvent(Event* event) {
      
    }
  };
};

#endif