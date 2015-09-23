#ifndef _CORE_EVENT_
#define _CORE_EVENT_

namespace core {
  class Event {
  public:
    int type;
    void* data;
    Event(int type, void* data):type(type),data(data) {
      
    }
    Event(int type):Event(type, NULL) {
      
    }
  };
};

#endif