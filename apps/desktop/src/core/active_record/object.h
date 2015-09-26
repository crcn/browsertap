#ifndef DOMAIN_OBJECT_H_
#define DOMAIN_OBJECT_H_

#include "../events/event_emitter.h"
#include "./events.h"
#include <json/json.h>

namespace activeRecord {

  // TODO - maybe change to active record
  class Object : public core::EventEmitter {
  public:
    Object();
    void remove();
    void update();
    virtual bool exists()=0;

    // TODO - lowercase this methdd to toJson()
    virtual Json::Value toJSON()=0;
    int id();
    virtual ~Object() { }
  private:
    static int _idCount;
  };
}

#endif