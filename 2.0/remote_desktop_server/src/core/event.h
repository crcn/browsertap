#ifndef _CORE_EVENT_
#define _CORE_EVENT_

namespace core {
  class Event {
  public:
    int type;
    Event(int type):type(type) {
      
    }
  };
};

#endif