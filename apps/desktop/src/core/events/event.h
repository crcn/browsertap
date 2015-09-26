#ifndef _CORE_EVENT_
#define _CORE_EVENT_

namespace core {
  class Event {
  public:
    int type;
    void* data;
    void* target;
    void* currentTarget;
    Event(int type, void* data):type(type),data(data), target(NULL), currentTarget(NULL) {
    }
    Event(int type):Event(type, NULL) {
      
    }
  };
};

#endif