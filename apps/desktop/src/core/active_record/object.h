#ifndef DOMAIN_OBJECT_H_
#define DOMAIN_OBJECT_H_

#include "../events/event_emitter.h"
#include "./events.h"
#include "../json/serializeable.h"
#include <json/json.h>

namespace activeRecord {

  // TODO - maybe change to active record
  class Object : public core::EventEmitter, public core::IJsonSerializable {
  public:
    Object();
    void remove();
    void update();
    virtual Json::Value toJson()=0;
    int id();
    virtual ~Object() { }
  private:
    static int _idCount;
    int _id;
  };
}

#endif
