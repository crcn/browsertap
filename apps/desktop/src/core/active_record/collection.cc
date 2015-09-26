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

  void Collection::handleEvent(core::Event* event) {
    // if (event->type == ObjectEvent.REMOVE) {
    //   // TODO 
    // }

    this->emit(event);
  }
}

