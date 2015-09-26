#include "./collection.h"
#include "../log/logger.h"

namespace activeRecord {

  Collection::Collection(std::string name):core::EventEmitter(), name(name) {
  }

  Object* Collection::insert(Object* object) {
    this->_objects.push_back(object);
    object->addListener(this);
    this->emit(ObjectEvent::INSERT, object);
    return object;
  }

  Object* Collection::remove(Object* object) {
    // TODO
    return object;
  }

  std::vector<Object*> Collection::find(Json::Value query) {
    std::vector<Object*> ret;
    for(int i = 0, n = this->_objects.size(); i < n; i++) {
      Object* object = this->_objects.at(i);
      Json::Value& objJson = object->toJSON();
      // TODO - query this
      ret.push_back(object);
    }
    return ret;
  }

  std::vector<Object*> Collection::all() {
    return this->_objects;
  }

  void Collection::handleEvent(core::Event* event) {
    // if (event->type == ObjectEvent.REMOVE) {
    //   // TODO 
    // }

    this->emit(event);
  }
}
