#ifndef DOMAIN_OBJECT_H_
#define DOMAIN_OBJECT_H_

#include "../events/event_emitter.h"
#include <json.h>

namespace domain {
  class Object : public core::EventEmitter {
  public:
    Object();
    void remove();
    void update();
    bool exists();
    virtual JSON::Value toJSON()=0;
    int id();
    ~Object();
  };
}

#endif