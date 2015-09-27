#ifndef MODELS_COLLECTION_H_
#define MODELS_COLLECTION_H_

#include "../events/event_emitter.h"
#include "./events.h"
#include "./object.h"
#include <json/json.h>

namespace activeRecord {

  class Collection : public core::EventEmitter, public core::EventListener {
  public:
    Collection(std::string);
    std::string name;
    Object* insert(Object* obj);
    Object* remove(Object* obj);
    std::vector<Object*> all();
    std::vector<Object*> find(Json::Value);
    Object* findOne(int id);
    void handleEvent(core::Event* event);
  private:
    std::vector<Object*> _objects;
  };
}

#endif